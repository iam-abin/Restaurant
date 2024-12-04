import mongoose, { Document, Schema } from 'mongoose';
import { IMenu } from '../../types';
import { omitDocFields } from '../../utils';

export interface IMenuDocument extends Document, Omit<IMenu, 'restaurantId'> {
    _id: Schema.Types.ObjectId;
    restaurantId: Schema.Types.ObjectId;
    isClosed: boolean;
}

const menuSchema = new Schema<IMenuDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be less than zero'],
        },
        imageUrl: {
            type: String,
            required: true,
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        isClosed: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const MenuModel = mongoose.model<IMenuDocument>('Menu', menuSchema);
