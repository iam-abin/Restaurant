import mongoose, { Schema } from 'mongoose';
import { ICart } from '../../types';
import { omitDocFields } from '../../utils';
import { IMenuDocument } from './menu.model';
import { IUserDocument } from './user.model';

export interface ICartDocument extends Document, Omit<ICart, 'userId' | 'menuItemId'> {
    _id: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId | IUserDocument;
    menuItemId: Schema.Types.ObjectId | IMenuDocument;
}

const cartSchema = new Schema<ICartDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        menuItemId: {
            type: Schema.Types.ObjectId,
            ref: 'Menu',
            required: true,
        },
        count: {
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