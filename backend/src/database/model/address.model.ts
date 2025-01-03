import mongoose, { Schema, Types } from 'mongoose';
import { IAddress } from '../../types';
import { omitDocFields } from '../../utils';

export interface IAddressDocument extends Document, Omit<IAddress, 'userId'> {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
}

const addressSchema = new Schema<IAddressDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
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

export const AddressModel = mongoose.model<IAddressDocument>('Address', addressSchema);
