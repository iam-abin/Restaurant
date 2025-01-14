import mongoose, { Schema, Types } from 'mongoose';
import { IRestaurant } from '../../types';
import { omitDocFields } from '../../utils';
import { IUserDocument } from './user.model';
import { IAddressDocument } from './address.model';

export interface IRestaurantDocument extends Document, Omit<IRestaurant, 'ownerId' | 'addressId'> {
    _id: Types.ObjectId;
    ownerId: Types.ObjectId | Pick<IUserDocument, 'name' | 'email' | 'phone'>;
    addressId: Types.ObjectId | IAddressDocument;
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
            ref: 'Address',
        },
        deliveryTime: {
            type: Number,
            default: 0,
        },
        imageUrl: {
            type: String,
            trim: true,
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
