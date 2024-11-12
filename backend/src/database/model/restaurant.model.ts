import mongoose, { Schema } from 'mongoose';
import { IRestaurant } from '../../types';
import { omitDocFields } from '../../utils';

export interface IRestaurantDocument extends Document, Omit<IRestaurant, 'userId'> {
    userId: Schema.Types.ObjectId;
    isBlocked: boolean;
}

const restaurantSchema = new Schema<IRestaurantDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        deliveryTime: {
            type: Number,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const RestaurantModel = mongoose.model<IRestaurantDocument>('Restaurant', restaurantSchema);
