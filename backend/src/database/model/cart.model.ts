import mongoose, { Schema } from 'mongoose';
import { ICart } from '../../types';
import { omitDocFields } from '../../utils';
import { IMenuDocument } from './menu.model';
import { IUserDocument } from './user.model';
import { IRestaurantDocument } from './restaurant.model';

export interface ICartDocument extends Document, Omit<ICart, 'userId' | 'itemId' | 'restaurantId'> {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId | IUserDocument;
    itemId: Schema.Types.ObjectId | IMenuDocument;
    restaurantId: Schema.Types.ObjectId | IRestaurantDocument;
}

const cartSchema = new Schema<ICartDocument>(
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
        itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Menu',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            // min: [1, ""]
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const CartModel = mongoose.model<ICartDocument>('Cart', cartSchema);
