import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
    userId: Schema.Types.ObjectId;
    otp: string;
    createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
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
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
        },
    },
);

export const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);
