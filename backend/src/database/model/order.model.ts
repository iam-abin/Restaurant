import mongoose, { Document, Schema } from 'mongoose';
import { IOrder } from '../../types';
import { omitDocFields } from '../../utils';
import { IUserDocument } from './user.model';
import { IRestaurantDocument } from './restaurant.model';

export interface IOrderDocument
    extends Document,
        Omit<IOrder, 'userId' | 'restaurantId' | 'cartId' | 'addressId'> {
    userId: Schema.Types.ObjectId | IUserDocument;
    restaurantId: Schema.Types.ObjectId | IRestaurantDocument;
    // cartId: Schema.Types.ObjectId;
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
