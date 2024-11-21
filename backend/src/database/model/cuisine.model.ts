import mongoose, { Schema } from 'mongoose';
import { ICuisine } from '../../types';
import { omitDocFields } from '../../utils';

export interface ICuisineDocument extends Document, ICuisine {
    _id: Schema.Types.ObjectId;
}

const cuisineSchema = new Schema<ICuisineDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: omitDocFields,
        },
    },
);

export const CuisineModel = mongoose.model<ICuisineDocument>('Cuisine', cuisineSchema);
