import { IRating } from '../../types';
import { IRatingDocument, RatingModel } from '../model/rating.model';
import mongoose, { DeleteResult } from 'mongoose';

export class RatingRepository {
    async findRating(restaurantId: string, userId: string): Promise<IRatingDocument | null> {
        return await RatingModel.findOne({ restaurantId, userId });
    }

    async findRestaurantRating(restaurantId: string): Promise<number> {
        const result = await RatingModel.aggregate([
            {
                $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) },
            },
            {
                $group: {
                    _id: '$restaurantId',
                    averageRating: { $avg: '$rating' },
                },
            },
        ]);

        return result[0].averageRating;
    }

    async updateRating({ userId, restaurantId, rating }: IRating): Promise<IRatingDocument | null> {
        return await RatingModel.findOneAndUpdate(
            { userId, restaurantId },
            { rating },
            { upsert: true, new: true },
        );
    }

    async countRestaurantRating(restaurantId: string): Promise<number> {
        return await RatingModel.countDocuments({ restaurantId });
    }

    async deleteRating(userId: string, restaurantId: string): Promise<DeleteResult> {
        return await RatingModel.deleteOne({ userId, restaurantId });
    }
}
