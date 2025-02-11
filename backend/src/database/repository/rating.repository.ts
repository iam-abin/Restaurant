import { IRating } from '../../types';
import { singleton } from 'tsyringe';
import { IRatingDocument, RatingModel } from '../model';
import mongoose, { DeleteResult } from 'mongoose';

@singleton()
export class RatingRepository {
    findUserRating = async (restaurantId: string, userId: string): Promise<IRatingDocument | null> => {
        return await RatingModel.findOne({ restaurantId, userId }).lean();
    };

    findRestaurantRating = async (restaurantId: string): Promise<number> => {
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

        return result.length > 0 ? result[0].averageRating : 0;
    };

    updateRating = async ({ userId, restaurantId, rating }: IRating): Promise<IRatingDocument | null> => {
        return await RatingModel.findOneAndUpdate(
            { userId, restaurantId },
            { rating },
            { upsert: true, new: true },
        );
    };

    countRestaurantRatings = async (restaurantId: string): Promise<number> => {
        return await RatingModel.countDocuments({ restaurantId });
    };

    deleteRating = async (userId: string, restaurantId: string): Promise<DeleteResult> => {
        return await RatingModel.deleteOne({ userId, restaurantId });
    };
}
