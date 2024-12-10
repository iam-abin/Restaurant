import mongoose, { Schema, Types } from 'mongoose';
import { IProfile } from '../../types';
import { omitDocFields } from '../../utils';

export interface IProfileDocument extends Document, Omit<IProfile, 'userId' | 'addressId'> {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    addressId: Types.ObjectId;
}

const profileSchema = new Schema<IProfileDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        addressId: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
            unique: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const ProfileModel = mongoose.model<IProfileDocument>('Profile', profileSchema);
