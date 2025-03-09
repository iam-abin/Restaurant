import mongoose, { Document, Schema, Types } from 'mongoose';
import { IOtpToken } from '../../types';
import { omitDocFields } from '../../utils';
import { OTP_EXPIRY_MILLISECONDS, OTP_EXPIRY_SECONDS } from '../../constants';

export interface IOtpTokenDocument extends Document, Omit<IOtpToken, 'userId'> {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    createdAt: Date;
    expiresAt: Date;
}

// Here we store otp as well as token
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
            index: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + OTP_EXPIRY_MILLISECONDS), // 60 seconds from now
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

// Define a TTL index explicitly on the createdAt field
otpTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: OTP_EXPIRY_SECONDS });

export const OtpTokenModel = mongoose.model<IOtpTokenDocument>('OtpToken', otpTokenSchema);
