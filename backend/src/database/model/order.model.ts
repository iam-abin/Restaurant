import mongoose, { Document, Schema } from 'mongoose';
import { IOrder } from '../../types';
import { omitDocFields } from '../../utils';

export interface IOrderDocument
    extends Document,
        Omit<IOrder, 'userId' | 'restaurantId' | 'cartId' | 'addressId'> {
    userId: Schema.Types.ObjectId;
    restaurantId: Schema.Types.ObjectId;
    cartId: Schema.Types.ObjectId;
    addressId: Schema.Types.ObjectId;
}

const orderSchema = new Schema<IOrderDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        cartId: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: true,
        },
        addressId: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered'],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const OrderModel = mongoose.model<IOrderDocument>('Order', orderSchema);
