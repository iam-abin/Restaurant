import mongoose, { Document, Schema } from 'mongoose';
import { IOrder } from '../../types';

export interface IOrderDocument extends Document, Omit<IOrder, 'userId' | 'restaurantId' | 'cartId'> {
    userId: Schema.Types.ObjectId;
    restaurantId: Schema.Types.ObjectId;
    cartId: Schema.Types.ObjectId;
}

const orderSchema = new Schema<IOrderDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Restaurant',
        },
        cartId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Cart',
        },
        // addressId: {
        //     type: Schema.Types.ObjectId,
        //     required: true,
        // },
        totalAmound: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
        },
    },
);

export const OrderModel = mongoose.model<IOrderDocument>('Order', orderSchema);
