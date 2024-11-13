import { autoInjectable } from 'tsyringe';
import { IOrder } from '../types';
import { OrderRepository, RestaurantRepository } from '../database/repository';
import { IOrderDocument } from '../database/model';
import { ForbiddenError, NotFoundError } from '../errors';

@autoInjectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly restaurantRepository: RestaurantRepository,
    ) {}

    public async createOrder(userId: string, restaurantData: IOrder): Promise<IOrderDocument | null> {
        const restaurant: IOrderDocument | null = await this.orderRepository.createOrder({
            ...restaurantData,
            userId,
        });

        return restaurant;
    }

    public async getOrders(restaurantId: string, ownerId: string): Promise<IOrderDocument[] | []> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
        if (restaurant?.ownerId.toString() !== ownerId)
            throw new ForbiddenError('You cannot access other restaurant orders');
        const orders: IOrderDocument[] | [] = await this.orderRepository.findOrders(restaurantId);
        return orders;
    }

    public async getMyOrders(userId: string): Promise<IOrderDocument[] | []> {
        const restaurant: IOrderDocument[] | [] = await this.orderRepository.findMyOrders(userId);
        return restaurant;
    }

    public async updateOrderStatus(orderId: string, status: string, ownerId: string): Promise<IOrderDocument | null> {
        const order: IOrderDocument | null = await this.orderRepository.findOrder(orderId);
        if (!order) throw new NotFoundError('Order not found');
        if ('ownerId' in order.restaurantId && order.restaurantId.ownerId.toString() !== ownerId)
            throw new ForbiddenError('You cannot update other restaurants order status');
        const updatedOrder: IOrderDocument | null = await this.orderRepository.updateOrderStatus(orderId, status);
        return updatedOrder;
    }
}
