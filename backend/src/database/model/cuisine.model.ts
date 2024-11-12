import mongoose, { Schema } from 'mongoose';
import { ICuisine } from '../../types';
import { omitDocFields } from '../../utils';

export interface ICuisineDocument extends Document, ICuisine {
    userId: Schema.Types.ObjectId;
}

const cuisineSchema = new Schema<ICuisineDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
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

export const CuisineModel = mongoose.model<ICuisineDocument>('Cart', cuisineSchema);
