import mongoose, { Schema } from 'mongoose';
import { ICart } from '../../types';
import { omitDocFields } from '../../utils';

export interface ICartDocument extends Document, Omit<ICart, 'userId'> {
    userId: Schema.Types.ObjectId;
}

const cartSchema = new Schema<ICartDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        menuId: {
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

export const CartModel = mongoose.model<ICartDocument>('Cart', cartSchema);
