import { autoInjectable } from 'tsyringe';
import mongoose from 'mongoose';
import Stripe from 'stripe';

import { IOrder } from '../types';
import {
    OrderRepository,
    RestaurantRepository,
    OrderedItemRepository,
    CartRepository,
    AddressRepository,
} from '../database/repository';
import { ICartDocument, IMenuDocument, IOrderDocument } from '../database/model';
import { ForbiddenError, NotFoundError } from '../errors';
import { stripeInstance } from '../config/stripe';
import { appConfig } from '../config/app.config';

@autoInjectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderedItemRepository: OrderedItemRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly cartRepository: CartRepository,
        private readonly addressRepository: AddressRepository,
    ) {}

    public async createOrder(userId: string, orderData: IOrder): Promise<{ stripePaymentUrl: string }> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Fetch restaurant and cart items in parallel

            const [cartItems, address] = await Promise.all([
                this.cartRepository.getCartItemsByRestaurant(userId, orderData.restaurantId),
                this.addressRepository.findByUserId(userId),
            ]);

            if (cartItems.length === 0) throw new NotFoundError('Must contain cart items to place order');
            const restaurantId = this.checkSameRestaurant(cartItems);
            const restaurant = this.restaurantRepository.findRestaurant(restaurantId);
            if (!restaurant) throw new NotFoundError('Restaurant not found');
            const totalAmound = this.findTotalAmound(cartItems);
            if (!address) throw new NotFoundError('Address not found');
            if (address.userId.toString() !== userId)
                throw new ForbiddenError('You cannot use others address');

            //         userId: string;
            // restaurantId: string;
            // // cartId: string;
            // addressId: string;
            // totalAmound: number;
            // status: 'pending' |

            // Create the order
            const order: IOrderDocument | null = await this.orderRepository.create(
                {
                    userId,
                    restaurantId,
                    addressId: address._id.toString(),
                    totalAmound,
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
                    orderId: order.id.toString(),
                    images: JSON.stringify(cartItems.map((item) => (item.itemId as IMenuDocument).imageUrl)),
                },
            });

            console.log('checkoutSession is ', checkoutSession);

            if (!checkoutSession.url) {
                throw new Error('Error while creating checkout session');
            }

            // Delete cart items in bulk
            await this.cartRepository.deleteAllItems(userId, session);
            const orderedItems = cartItems.map((item) => ({
                menuItemId: item._id.toString(),
                menuItemPrice: (item.itemId as IMenuDocument).price,
                orderId: order.id,
                userId,
            }));

            // Adding ordered items to OrderedItems collection
            await this.orderedItemRepository.create(orderedItems, session);
            // Commit the transaction
            await session.commitTransaction();
            return { stripePaymentUrl: checkoutSession.url };
        } catch (error) {
            // Rollback the transaction if something goes wrong
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    private checkSameRestaurant(cartItems: ICartDocument[]) {
        if (cartItems.length === 0) throw new Error('Cart is empty');

        // Extract the restaurantId of the first cart item
        const firstRestaurantId = (cartItems[0].itemId as IMenuDocument).restaurantId.toString();

        // Check if all items in the cart have the same restaurantId
        for (const item of cartItems) {
            const currentRestaurantId = (item.itemId as IMenuDocument).restaurantId.toString();
            if (currentRestaurantId !== firstRestaurantId) {
                throw new Error('All items in the cart must be from the same restaurant');
            }
        }

        // Return the restaurantId if all are the same
        return firstRestaurantId;
    }

    private findTotalAmound(cartItems: ICartDocument[]) {
        if (cartItems.length === 0) throw new Error('Cart is empty');

        // Check if all items in the cart have the same restaurantId
        const totalAmound = cartItems.reduce((acc: number, currItem: ICartDocument) => {
            acc = acc + (currItem.itemId as IMenuDocument).price;
            return acc;
        }, 0);

        // Return the restaurantId if all are the same
        return totalAmound;
    }

    private createLineItems(cartItems: ICartDocument[]) {
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
    }

    public async getOrders(restaurantId: string, ownerId: string): Promise<IOrderDocument[]> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        if ('_id' in restaurant.owner! && restaurant.owner._id.toString() !== ownerId)
            throw new ForbiddenError('You cannot access other restaurant orders');
        const orders: IOrderDocument[] = await this.orderRepository.findOrders(restaurantId);
        return orders;
    }

    public async getMyOrders(userId: string): Promise<IOrderDocument[]> {
        const restaurant: IOrderDocument[] = await this.orderRepository.findMyOrders(userId);
        return restaurant;
    }

    public async confirmOrder(
        status: string,
        requestBody: string | Buffer,
        signature: string | Buffer | Array<string>,
    ): Promise<IOrderDocument | null> {
        const webhookEndPointSecret: string = appConfig.STRIPE_WEBHOOK_ENDPOINT_SECRET;
        console.log('webhookEndPointSecret', webhookEndPointSecret);

        const event: Stripe.Event = stripeInstance.webhooks.constructEvent(
            JSON.stringify(requestBody),
            signature,
            webhookEndPointSecret,
        );
        console.log('event', event);
        // Handle the checkout session completed event
        if (event.type !== 'checkout.session.completed') {
            throw new Error('Payment confirmation failed');
        }
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.metadata?.orderId) throw new Error('Order ID is missing in the session metadata');

        const order: IOrderDocument | null = await this.orderRepository.findOrder(session.metadata.orderId!);

        if (!order) throw new NotFoundError('Order not found');

        const confirmedOrder = this.orderRepository.updateStatus(order._id.toString(), status);
        // Update the order with the amount and status
        // if (session.amount_total) {
        //     order.totalAmount = session.amount_total;
        // }

        return confirmedOrder;
    }

    public async updateOrderStatus(
        orderId: string,
        status: string,
        ownerId: string,
    ): Promise<IOrderDocument | null> {
        const order: IOrderDocument | null = await this.orderRepository.findOrder(orderId);
        if (!order) throw new NotFoundError('Order not found');
        if ('ownerId' in order.restaurantId && order.restaurantId.ownerId.toString() !== ownerId)
            throw new ForbiddenError('You cannot update other restaurants order status');
        const updatedOrder: IOrderDocument | null = await this.orderRepository.updateStatus(orderId, status);
        return updatedOrder;
    }
}
