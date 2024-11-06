import mongoose, { Document, Schema } from 'mongoose';
import { IMenu } from '../../types';

export interface IMenuDocument extends Document, Omit<IMenu, 'restaurantId'> {
    restaurantId: Schema.Types.ObjectId;
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
        },
        imageUrl: {
            type: String,
            required: true,
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
        },
    },
);

export const MenuModel = mongoose.model<IMenuDocument>('Menu', menuSchema);
