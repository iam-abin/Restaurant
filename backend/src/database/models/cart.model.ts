import mongoose, { Schema, Types } from 'mongoose';
import { ICart } from '../../types';
import { omitDocFields } from '../../utils';
import { IMenuDocument } from './menu.model';
import { IUserDocument } from './user.model';
import { IRestaurantDocument } from './restaurant.model';
import { CART_MAX_QUANTITY, CART_MIN_QUANTITY } from '../../constants';

export interface ICartDocument extends Document, Omit<ICart, 'userId' | 'itemId' | 'restaurantId'> {
    _id: Types.ObjectId;
    userId: Types.ObjectId | IUserDocument;
    itemId: Types.ObjectId | IMenuDocument;
    restaurantId: Types.ObjectId | IRestaurantDocument;
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
            min: CART_MIN_QUANTITY,
            max: CART_MAX_QUANTITY,
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
