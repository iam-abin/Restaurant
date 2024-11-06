import mongoose, { Document, Schema } from 'mongoose';
import { IMenu } from '../../types';

export interface IMenuDocument extends Document, IMenu {}

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
        image: {
            type: String,
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
