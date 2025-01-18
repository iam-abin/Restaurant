import Stripe from 'stripe';
import { autoInjectable } from 'tsyringe';
import { GetRestaurantOrders, IOrder, Orders, OrderStatus } from '../types';
import {
    OrderRepository,
    RestaurantRepository,
    OrderedItemRepository,
    CartRepository,
    AddressRepository,
} from '../database/repository';
import {
    IAddressDocument,
    ICartDocument,
    IMenuDocument,
    IOrderDocument,
    IRestaurantDocument,
} from '../database/model';
import { ForbiddenError, NotFoundError } from '../errors';
import { stripeInstance } from '../config/stripe';
import { appConfig } from '../config/app.config';
import { executeTransaction, getPaginationSkipValue, getPaginationTotalNumberOfPages } from '../utils';

@autoInjectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderedItemRepository: OrderedItemRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly cartRepository: CartRepository,
        private readonly addressRepository: AddressRepository,
    ) {}

    public createOrder = async (
        userId: string,
        orderData: Pick<IOrder, 'restaurantId'>,
    ): Promise<{ stripePaymentUrl: string }> => {
        const { restaurantId } = orderData;
        return executeTransaction(async (session) => {
            const restaurant: IRestaurantDocument | null =
                await this.restaurantRepository.findRestaurant(restaurantId);
            if (!restaurant) throw new NotFoundError('Restaurant not found');

            const [cartItems, address]: [ICartDocument[], IAddressDocument | null] = await Promise.all([
                this.cartRepository.findCartItemsByRestaurant(userId, restaurantId),
                this.addressRepository.findAddressByUserId(userId),
            ]);

            if (cartItems.length === 0) throw new NotFoundError('Must contain cart items to place order');

            const totalAmount: number = this.findtotalAmount(cartItems);
            if (!address) throw new NotFoundError('Must fill address details');
            // if (address.userId.toString() !== userId)
            //     throw new ForbiddenError('You cannot use others address');

            // Create the order
            const order: IOrderDocument | null = await this.orderRepository.createOrder(
                {
                    userId,
                    restaurantId,
                    addressId: address._id.toString(),
                    totalAmount,
                    status: 'pending',
                },
                session,
            );

            // Line items
            const lineItems = this.createLineItems(cartItems);

            const checkoutSession = await stripeInstance.checkout.sessions.create({
                payment_method_types: ['card'],
                shipping_address_collection: {
                    allowed_countries: ['IN', 'US', 'CA'],
                },
                line_items: lineItems,
                mode: 'payment',
                success_url: appConfig.PAYMENT_SUCCESS_URL,
                cancel_url: appConfig.PAYMENT_CANCEL_URL,
                metadata: {
                    orderId: order._id.toString(),
                    images: JSON.stringify(cartItems.map((item) => (item.itemId as IMenuDocument).imageUrl)),
                },
            });

            if (!checkoutSession.url) {
                throw new Error('Error while creating checkout session');
            }

            // Delete cart items in bulk
            await this.cartRepository.deleteAllCartItems(userId, session);

            const orderedItems = cartItems.map((item) => ({
                userId,
                orderId: order._id.toString(),
                restaurantId,
                quantity: item.quantity,
                menuItemId: (item.itemId as IMenuDocument)._id.toString(),
                menuItemPrice: (item.itemId as IMenuDocument)?.salePrice ?? (item.itemId as IMenuDocument).price,
            }));

            // Adding ordered items to OrderedItems collection
            await this.orderedItemRepository.createOrderedItem(orderedItems, session);

            return { stripePaymentUrl: checkoutSession.url };
        });
    };

    private findtotalAmount = (cartItems: ICartDocument[]) => {
        if (cartItems.length === 0) throw new Error('Cart is empty');

        // Check if all items in the cart have the same restaurantId
        const totalAmount = cartItems.reduce((acc: number, currItem: ICartDocument) => {
            acc = acc + (currItem.itemId as IMenuDocument).price * currItem.quantity;
            return acc;
        }, 0);

        // Return the restaurantId if all are the same
        return totalAmount;
    };

    private createLineItems = (cartItems: ICartDocument[]) => {
        // create line items (line items will display in the stripe payment interface as list)
        const lineItems = cartItems.map((cartItem: ICartDocument) => {
            const menuItem = cartItem.itemId as IMenuDocument;
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: menuItem.name,
                        images: [menuItem.imageUrl],
                    },
                    unit_amount: menuItem.price * 100, // Amount in cents (299 INR * 100)
                },
                quantity: cartItem.quantity,
            };
        });

        // return line items
        return lineItems;
    };

    public getRestaurantOrders = async ({
        restaurantId,
        ownerId,
        page,
        limit,
    }: GetRestaurantOrders): Promise<Orders> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        if ('_id' in restaurant.ownerId! && restaurant.ownerId._id.toString() !== ownerId)
            throw new ForbiddenError('You cannot access other restaurant orders');

        const skip: number = getPaginationSkipValue(page, limit);

        const [orders, myOrdersCount]: [IOrderDocument[], number] = await Promise.all([
            this.orderRepository.findOrders(restaurantId, skip, limit),
            this.orderRepository.countRestaurantOrders({ restaurantId }),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(myOrdersCount, limit);
        return { orders, numberOfPages };
    };

    public getMyOrders = async (userId: string, page: number, limit: number): Promise<Orders> => {
        const skip: number = getPaginationSkipValue(page, limit);

        const [orders, myOrdersCount]: [IOrderDocument[], number] = await Promise.all([
            this.orderRepository.findMyOrders(userId, skip, limit),
            this.orderRepository.countUserOrders({ userId }),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(myOrdersCount, limit);
        return { orders, numberOfPages };
    };

    public confirmOrder = async (
        status: string,
        requestBody: Buffer,
        stripeSignature: string | Buffer | Array<string>,
    ): Promise<IOrderDocument | null> => {
        const webhookEndPointSecret: string = appConfig.STRIPE_WEBHOOK_ENDPOINT_SECRET;

        const event: Stripe.Event = stripeInstance.webhooks.constructEvent(
            requestBody,
            stripeSignature,
            webhookEndPointSecret,
        );

        // Handle the checkout session completed event
        if (event.type === 'checkout.session.completed') {
            const checkoutSession = event.data.object as Stripe.Checkout.Session;

            if (!checkoutSession.metadata?.orderId)
                throw new Error('Order ID is missing in the session metadata');

            const order: IOrderDocument | null = await this.orderRepository.findOrderById(
                checkoutSession.metadata.orderId!,
            );
            if (!order) throw new NotFoundError('Order not found');

            const confirmedOrder = this.orderRepository.updateOrderStatus(order._id.toString(), status);
            return confirmedOrder;
        }
        return null;
    };

    public updateOrderStatus = async (
        orderId: string,
        status: OrderStatus,
        ownerId: string,
    ): Promise<IOrderDocument | null> => {
        const order: IOrderDocument | null = await this.orderRepository.findOrderById(orderId);
        if (!order) throw new NotFoundError('Order not found');
        if ('ownerId' in order.restaurantId && order.restaurantId.ownerId.toString() !== ownerId)
            throw new ForbiddenError('You cannot update other restaurants order status');
        const updatedOrder: IOrderDocument | null = await this.orderRepository.updateOrderStatus(
            orderId,
            status,
        );
        return updatedOrder;
    };
}
