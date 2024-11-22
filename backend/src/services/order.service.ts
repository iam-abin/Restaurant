import { autoInjectable } from 'tsyringe';
import mongoose from 'mongoose';

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

    public async createOrder(userId: string, orderData: IOrder): Promise<IOrderDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Fetch restaurant and cart items in parallel
            const [restaurant, cartItems, address] = await Promise.all([
                this.restaurantRepository.findRestaurant(orderData.restaurantId),
                this.cartRepository.findAllByUserId(userId),
                this.addressRepository.findById(orderData.addressId),
            ]);

            if (!restaurant) throw new NotFoundError('Restaurant not found');
            if (cartItems.length === 0) throw new NotFoundError('Must contain cart items to place order');
            if (!address) throw new NotFoundError('Address not found');
            if (address.userId.toString() !== userId)
                throw new ForbiddenError('You cannot use others address');

            // Create the order
            const order: IOrderDocument | null = await this.orderRepository.create(
                {
                    ...orderData,
                    status: 'pending',
                    userId,
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

            await this.orderedItemRepository.create(orderedItems, session);
            // Commit the transaction
            await session.commitTransaction();
            return order;
        } catch (error) {
            // Rollback the transaction if something goes wrong
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
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
        if ('id' in restaurant.ownerId && restaurant.ownerId.id.toString() !== ownerId)
            throw new ForbiddenError('You cannot access other restaurant orders');
        const orders: IOrderDocument[] = await this.orderRepository.findOrders(restaurantId);
        return orders;
    }

    public async getMyOrders(userId: string): Promise<IOrderDocument[]> {
        const restaurant: IOrderDocument[] = await this.orderRepository.findMyOrders(userId);
        return restaurant;
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
