import { IOrder } from '../../types';
import { IOrderDocument, OrderModel } from '../model';

export class OrderRepository {
    async createOrder(orderData: IOrder): Promise<IOrderDocument> {
        const order: IOrderDocument = await OrderModel.create(orderData);
        return order;
    }

    async getMyOrders(userId: string): Promise<IOrderDocument[] | []> {
        return await OrderModel.find({ userId });
    }

    async getOrders(restaurantId: string): Promise<IOrderDocument[] | []> {
        return await OrderModel.find({ restaurantId });
    }

    async updateOrderStatus(orderId: string, status: string): Promise<IOrderDocument | null> {
        const order: IOrderDocument | null = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            {
                new: true,
            },
        );
        return order;
    }
}
