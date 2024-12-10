import mongoose, { Document, Schema, Types } from 'mongoose';
import { IOtpToken } from '../../types';
import { omitDocFields } from '../../utils';

// Use Omit to exclude 'string type' userId from IOtpToken and redefine it in IOtpTokenDocument
export interface IOtpTokenDocument extends Document, Omit<IOtpToken, 'userId'> {
    userId: Types.ObjectId;
    createdAt: Date;
}

// Here can also store token
const otpTokenSchema = new Schema<IOtpTokenDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        otp: {
            type: String,
            minlength: 6,
            maxlength: 6,
        },
        resetToken: {
            type: String,
            minlength: 80,
            maxlength: 80,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 600, // TTL index: 10 minutes (600 seconds)
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const OtpTokenModel = mongoose.model<IOtpTokenDocument>('OtpToken', otpTokenSchema);
