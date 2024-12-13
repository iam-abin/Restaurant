import mongoose, { Schema, Types } from 'mongoose';
import { IRestaurant } from '../../types';
import { omitDocFields } from '../../utils';
import { ICuisineDocument } from './cuisine.model';

export interface IRestaurantCuisineDocument extends Document {
    _id: Types.ObjectId;
    cuisineId: Types.ObjectId | ICuisineDocument;
    restaurantId: Types.ObjectId | IRestaurant;
}

const restaurantCuisineSchema = new Schema<IRestaurantCuisineDocument>(
    {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        cuisineId: {
            type: Schema.Types.ObjectId,
            ref: 'Cuisine',
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

export const RestaurantCuisineModel = mongoose.model<IRestaurantCuisineDocument>(
    'RestaurantCuisine',
    restaurantCuisineSchema,
);
