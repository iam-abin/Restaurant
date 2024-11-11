import mongoose, { Schema } from 'mongoose';
import { IRestaurant } from '../../types';

export interface IRestaurantDocument extends Document, Omit<IRestaurant, 'userId'> {
    userId: Schema.Types.ObjectId;
    isBlocked: boolean;
}

const restaurantSchema = new Schema<IRestaurantDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false,
    },
});

export const RestaurantModel = mongoose.model<IRestaurantDocument>('Restaurant', restaurantSchema);
