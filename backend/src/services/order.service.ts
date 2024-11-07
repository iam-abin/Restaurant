import { autoInjectable } from 'tsyringe';
import { IOrder } from '../types';
import { OrderRepository } from '../database/repository';
import { IOrderDocument } from '../database/model';

@autoInjectable()
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {}

    public async createOrder(userId: string, restaurantData: IOrder): Promise<IOrderDocument | null> {
        const restaurant: IOrderDocument | null = await this.orderRepository.createOrder({
            ...restaurantData,
            userId,
        });

        return restaurant;
    }
}
