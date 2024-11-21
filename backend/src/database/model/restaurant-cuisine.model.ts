import mongoose, { Schema } from 'mongoose';
import { IRestaurant } from '../../types';
import { omitDocFields } from '../../utils';
import { ICuisineDocument } from './cuisine.model';

export interface IRestaurantCuisineDocument extends Document {
    _id: Schema.Types.ObjectId;
    cuisineId: Schema.Types.ObjectId | ICuisineDocument;
    restaurantId: Schema.Types.ObjectId | IRestaurant;
}

const restaurantCuisineSchema = new Schema<IRestaurantCuisineDocument>(
    {
        cuisineId: {
            type: Schema.Types.ObjectId,
            ref: 'Cuisine',
            required: true,
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
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
