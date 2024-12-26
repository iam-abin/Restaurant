import { ClientSession } from 'mongoose';
import { IRestaurantCuisineDocument, RestaurantCuisineModel } from '../model';

interface IRestaurantCuisine {
    cuisineId: string;
    restaurantId: string;
}
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

    async find(restaurantId: string): Promise<IRestaurantCuisineDocument[]> {
        return await RestaurantCuisineModel.find({ restaurantId }).populate('cuisineId');
    }

    async countRestaurantCuisines(restaurantId: string): Promise<number> {
        return await RestaurantCuisineModel.countDocuments({ restaurantId });
    }
}
