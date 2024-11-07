import { IOrder } from '../../types';
import { IOrderDocument, OrderModel } from '../model';

export class OrderRepository {
    async createOrder(orderData: IOrder): Promise<IOrderDocument> {
        const order: IOrderDocument = await OrderModel.create(orderData);
        return order;
    }

    async updateOrder(orderId: string, updatedData: Partial<IOrder>): Promise<IOrderDocument | null> {
        const order: IOrderDocument | null = await OrderModel.findByIdAndUpdate(orderId, updatedData, {
            new: true,
        });
        return order;
    }
}
