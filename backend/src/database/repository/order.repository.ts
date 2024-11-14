import mongoose from 'mongoose';
import { IOrder } from '../../types';
import { IOrderDocument, OrderModel } from '../model';

export class OrderRepository {
    async create(orderData: IOrder, session?: mongoose.ClientSession): Promise<IOrderDocument> {
        const order: IOrderDocument[] = await OrderModel.create([orderData], { session });
        return order[0];
    }

    async findMyOrders(userId: string): Promise<IOrderDocument[]> {
        return await OrderModel.find({ userId });
    }

    async findOrders(restaurantId: string): Promise<IOrderDocument[]> {
        return await OrderModel.find({ restaurantId });
    }

    async findOrder(orderId: string): Promise<IOrderDocument | null> {
        return await OrderModel.findById(orderId).populate('userId').populate('restaurantId');
    }

    async updateStatus(orderId: string, status: string): Promise<IOrderDocument | null> {
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
