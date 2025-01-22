import mongoose, { Document, Schema, Types } from 'mongoose';
import { omitDocFields } from '../../utils';
import { IRating } from '../../types/rating';

export interface IRatingDocument extends Document, Omit<IRating, 'userId' | 'restaurantId'> {
    restaurantId: Types.ObjectId;
    userId: Types.ObjectId;
}

const ratingSchema = new Schema<IRatingDocument>(
    {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: [1, 'Rating cannot be less than 1'],
            max: [5, 'Rating cannot be more than 5'],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

// Compound index for userId and restaurantId
ratingSchema.index({ userId: 1, restaurantId: 1 });

export const RatingModel = mongoose.model<IRatingDocument>('Rating', ratingSchema);
