import Stripe from 'stripe';
import { autoInjectable } from 'tsyringe';
import { GetRestaurantOrders, IOrder, IOrderedItem, IStripeLintItems, Orders, OrderStatus } from '../types';
import {
    OrderRepository,
    RestaurantRepository,
    OrderedItemRepository,
    CartRepository,
    AddressRepository,
} from '../database/repositories';
import {
    IAddressDocument,
    ICartDocument,
    IMenuDocument,
    IOrderDocument,
    IRestaurantDocument,
    IUserDocument,
} from '../database/models';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { stripeInstance } from '../config/stripe';
import { appConfig } from '../config/app-config';
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
            const restaurant: IRestaurantDocument | null = await this.restaurantRepository.findRestaurantById(
                restaurantId,
                session,
            );
            if (!restaurant) throw new BadRequestError('Restaurant does not exist');

            const [cartItems, address]: [ICartDocument[], IAddressDocument | null] = await Promise.all([
                this.cartRepository.findCartItemsByRestaurant({ userId, restaurantId, session }),
                this.addressRepository.findAddressByUserId(userId, session),
            ]);

            if (cartItems.length === 0) throw new BadRequestError('Must contain cart items to place order');

            const closedMenuItems: string[] = this.findClosedMenuItems(cartItems);
            if (closedMenuItems.length) {
                const isLengthOne: boolean = closedMenuItems.length === 1;
                throw new BadRequestError(
                    `${closedMenuItems.join(', ')} ${isLengthOne ? 'is a' : 'are'} closed item${isLengthOne ? '.' : 's.'}` +
                        `Remove ${isLengthOne ? 'it' : 'them'} from cart to proceed`,
                );
            }

            if (!address) throw new BadRequestError('Must fill address details');

            const totalAmount: number = this.calculateTotalAmount(cartItems);

            // Create the order
            const order: IOrderDocument | null = await this.orderRepository.createOrder(
                {
                    userId,
                    restaurantId,
                    addressId: address._id.toString(),
                    totalAmount,
                    status: OrderStatus.PENDING,
                },
                session,
            );

            const lineItems: IStripeLintItems[] = this.createLineItems(cartItems);
            const checkoutSession: Stripe.Checkout.Session = await this.createStripeSession(
                lineItems,
                order._id.toString(),
                cartItems,
            );

            if (!checkoutSession.url) throw new Error('Error while creating checkout session');

            return { stripePaymentUrl: checkoutSession.url };
        });
    };

    public getRestaurantOrders = async ({
        restaurantId,
        ownerId,
        page,
        limit,
    }: GetRestaurantOrders): Promise<Orders> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurantById(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');

        if ((restaurant.ownerId as IUserDocument)._id.toString() !== ownerId)
            throw new ForbiddenError('You cannot access other restaurant orders');

        const skip: number = getPaginationSkipValue(page, limit);

        const [orders, myOrdersCount]: [IOrderDocument[], number] = await Promise.all([
            this.orderRepository.findRestaurantOrders(restaurantId, skip, limit),
            this.orderRepository.countRestaurantOrders({ restaurantId }),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(myOrdersCount, limit);
        return { orders, numberOfPages };
    };

    public getMyOrders = async (userId: string, page: number, limit: number): Promise<Orders> => {
        const skip: number = getPaginationSkipValue(page, limit);

        const [orders, myOrdersCount]: [IOrderDocument[], number] = await Promise.all([
            this.orderRepository.findUserOrders(userId, skip, limit),
            this.orderRepository.countUserOrders({ userId }),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(myOrdersCount, limit);
        return { orders, numberOfPages };
    };

    public confirmOrder = async (
        status: OrderStatus,
        requestBody: Buffer,
        stripeSignature: string | Buffer | Array<string>,
    ): Promise<IOrderDocument | null> => {
        return executeTransaction(async (session) => {
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
                    session,
                );
                if (!order) throw new NotFoundError('Order not found');

                let userId: string;
                if (typeof order.userId === 'string') {
                    userId = order.userId;
                } else {
                    userId = (order.userId as IUserDocument)._id.toString();
                }

                const restaurantId: string = (order.restaurantId as IRestaurantDocument)._id.toString();
                // Delete cart items in bulk
                await this.cartRepository.deleteAllCartItems(order.userId.toString(), session);

                const cartItems: ICartDocument[] = await this.cartRepository.findCartItemsByRestaurant({
                    userId,
                    restaurantId,
                    session,
                });

                if (cartItems.length === 0) throw new NotFoundError('Must contain cart items to place order');

                // Transforming cart items to ordered items with order details
                const orderedItems: IOrderedItem[] = this.createOrderedItems(
                    cartItems,
                    order._id.toString(),
                    restaurantId,
                    userId,
                );

                // Adding ordered items to OrderedItems collection
                await this.orderedItemRepository.createOrderedItem(orderedItems, session);

                const confirmedOrder = await this.orderRepository.updateOrderStatus(
                    order._id.toString(),
                    status,
                    session,
                );
                return confirmedOrder;
            }
            return null;
        });
    };

    public updateOrderStatus = async (
        orderId: string,
        status: OrderStatus,
        ownerId: string,
    ): Promise<IOrderDocument | null> => {
        const order: IOrderDocument | null = await this.orderRepository.findOrderById(orderId);
        if (!order) throw new NotFoundError('Order not found');

        if ((order.restaurantId as IRestaurantDocument).ownerId.toString() !== ownerId)
            throw new ForbiddenError('You cannot update other restaurants order status');
        const updatedOrder: IOrderDocument | null = await this.orderRepository.updateOrderStatus(
            orderId,
            status,
        );
        return updatedOrder;
    };

    // Helper function to create Stripe session
    private createStripeSession = async (
        lineItems: IStripeLintItems[],
        orderId: string,
        cartItems: ICartDocument[],
    ): Promise<Stripe.Checkout.Session> => {
        return await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: { allowed_countries: ['IN'] },
            line_items: lineItems,
            mode: 'payment',
            success_url: appConfig.PAYMENT_SUCCESS_URL,
            cancel_url: appConfig.PAYMENT_CANCEL_URL,
            metadata: {
                orderId: orderId,
                images: JSON.stringify(cartItems.map((item) => (item.itemId as IMenuDocument).imageUrl)),
            },
        });
    };

    private findClosedMenuItems = (cartItems: ICartDocument[]): string[] => {
        const closedMenuItems: string[] = cartItems
            .filter((cartItem: ICartDocument) => {
                const menuItem = cartItem.itemId as IMenuDocument;
                return menuItem.isClosed;
            })
            .map((cartItem: ICartDocument) => (cartItem.itemId as IMenuDocument).name);

        return closedMenuItems;
    };

    // Helper function to calculate total order amound
    private calculateTotalAmount = (cartItems: ICartDocument[]): number => {
        if (cartItems.length === 0) throw new Error('Cart is empty');

        const totalAmount: number = cartItems.reduce((acc: number, currItem: ICartDocument) => {
            const effectivePrice =
                (currItem.itemId as IMenuDocument).salePrice || (currItem.itemId as IMenuDocument).price;
            acc += effectivePrice * currItem.quantity;
            return acc;
        }, 0);

        return totalAmount;
    };

    // Helper function to create ordered items
    private createOrderedItems = (
        cartItems: ICartDocument[],
        orderId: string,
        restaurantId: string,
        userId: string,
    ): IOrderedItem[] => {
        return cartItems.map((item) => ({
            userId,
            orderId,
            restaurantId,
            quantity: item.quantity,
            menuItemId: (item.itemId as IMenuDocument)._id.toString(),
            menuItemPrice: (item.itemId as IMenuDocument).salePrice ?? (item.itemId as IMenuDocument).price,
        }));
    };

    private createLineItems = (cartItems: ICartDocument[]): IStripeLintItems[] => {
        // create line items (line items will display in the stripe payment interface as list)
        const lineItems: IStripeLintItems[] = cartItems.map((cartItem: ICartDocument) => {
            const menuItem = cartItem.itemId as IMenuDocument;
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: menuItem.name,
                        images: [menuItem.imageUrl],
                    },
                    unit_amount: (menuItem.salePrice || menuItem.price) * 100, // Amount in cents (299 INR * 100)
                },
                quantity: cartItem.quantity,
            };
        });

        // return line items
        return lineItems;
    };
}
