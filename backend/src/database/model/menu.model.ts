import mongoose, { Document, Schema, Types } from 'mongoose';
import { IMenu } from '../../types';
import { omitDocFields } from '../../utils';

export interface IMenuDocument extends Document, Omit<IMenu, 'restaurantId' | 'cuisine' | 'cuisineId'> {
    _id: Types.ObjectId;
    restaurantId: Types.ObjectId;
    cuisineId: Types.ObjectId;
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
        salePrice: {
            type: Number,
            min: [0, 'Price cannot be less than zero'],
            validate: {
                validator: function (value: number) {
                    return value <= this.price;
                },
                message: 'Sale price must be less than or equal to the original price',
            },
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
        cuisineId: {
            type: Schema.Types.ObjectId,
            ref: 'Cuisine',
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
