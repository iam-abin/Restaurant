import mongoose, { Schema, Types } from 'mongoose';
import { IOrderedItem } from '../../types';
import { omitDocFields } from '../../utils';

export interface IOrderedItemDocument
    extends Document,
        Omit<IOrderedItem, 'userId' | 'orderId' | 'menuItemId'> {
    userId: Types.ObjectId;
    orderId: Types.ObjectId;
    menuItemId: Types.ObjectId;
}

const orderedItemSchema = new Schema<IOrderedItemDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            index: true,
        },
        menuItemId: {
            type: Schema.Types.ObjectId,
            ref: 'Menu',
            required: true,
            index: true,
        },
        menuItemPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const OrderedItemModel = mongoose.model<IOrderedItemDocument>('OrderedItem', orderedItemSchema);
