import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IRestaurantCuisineDocument, RestaurantCuisineModel } from '../model';
import { IRestaurantCuisine } from '../../types';

@singleton()
export class RestaurantCuisineRepository {
    create = async (
        restaurantCuisineData: IRestaurantCuisine,
        session?: ClientSession,
    ): Promise<IRestaurantCuisineDocument> => {
        const restaurantCuisine: IRestaurantCuisineDocument[] = await RestaurantCuisineModel.create(
            [restaurantCuisineData],
            { session },
        );
        return restaurantCuisine[0];
    };

    findRestaurantCuisines = async (restaurantId: string): Promise<IRestaurantCuisineDocument[]> => {
        return await RestaurantCuisineModel.find({ restaurantId })
            .populate({
                path: 'cuisineId',
                select: '-createdAt -updatedAt',
            })
            .select('-_id cuisineId');
    };

    findRestaurantCuisine = async (
        restaurantId: string,
        cuisineId: string,
    ): Promise<IRestaurantCuisineDocument | null> => {
        return await RestaurantCuisineModel.findOne({ restaurantId, cuisineId }).populate('cuisineId');
    };

    countRestaurantCuisines = async (restaurantId: string): Promise<number> => {
        return await RestaurantCuisineModel.countDocuments({ restaurantId });
    };
}
