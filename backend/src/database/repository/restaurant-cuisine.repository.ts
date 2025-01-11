import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IRestaurantCuisineDocument, RestaurantCuisineModel } from '../model';
import { IRestaurantCuisine } from '../../types';

@singleton()
export class RestaurantCuisineRepository {
    async create(
        restaurantCuisineData: IRestaurantCuisine,
        session?: ClientSession,
    ): Promise<IRestaurantCuisineDocument> {
        const restaurantCuisine: IRestaurantCuisineDocument[] = await RestaurantCuisineModel.create(
            [restaurantCuisineData],
            { session },
        );
        return restaurantCuisine[0];
    }

    async findRestaurantCuisines(restaurantId: string): Promise<IRestaurantCuisineDocument[]> {
        return await RestaurantCuisineModel.find({ restaurantId }).populate('cuisineId');
    }

    async findRestaurantCuisine(
        restaurantId: string,
        cuisineId: string,
    ): Promise<IRestaurantCuisineDocument | null> {
        return await RestaurantCuisineModel.findOne({ restaurantId, cuisineId }).populate('cuisineId');
    }

    async countRestaurantCuisines(restaurantId: string): Promise<number> {
        return await RestaurantCuisineModel.countDocuments({ restaurantId });
    }
}
