import mongoose, { Document, Schema } from 'mongoose';
import { IOtp } from '../../types';
import { omitDocFields } from '../../utils';

// Use Omit to exclude 'string type' userId from IOtp and redefine it in IOtpDocument
export interface IOtpDocument extends Document, Omit<IOtp, 'userId'> {
    userId: Schema.Types.ObjectId;
    createdAt: Date;
}

const otpSchema = new Schema<IOtpDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        otp: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 6,
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

export const OtpModel = mongoose.model<IOtpDocument>('Otp', otpSchema);
