import mongoose, { Schema } from 'mongoose';
import { IRestaurant } from '../../types';
import { omitDocFields } from '../../utils';
import { IUserDocument } from './user.model';
import { IAddressDocument } from './address.model';

export interface IRestaurantDocument extends Document, Omit<IRestaurant, 'ownerId' | 'addressId'> {
    _id: Schema.Types.ObjectId;
    ownerId: Schema.Types.ObjectId | IUserDocument;
    addressId: Schema.Types.ObjectId | IAddressDocument;
    isBlocked: boolean;
}

const restaurantSchema = new Schema<IRestaurantDocument>(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        addressId: {
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
