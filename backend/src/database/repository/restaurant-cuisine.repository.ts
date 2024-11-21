import { ClientSession } from 'mongoose';
import { IRestaurantCuisineDocument, RestaurantCuisineModel } from '../model';

export class RestaurantCuisineRepository {
    async insertRestaurantCuisines(
        restaurantCousines: {
            cuisineId: string;
            restaurantId: string | undefined;
        }[],
        session?: ClientSession,
    ): Promise<IRestaurantCuisineDocument[]> {
        return await RestaurantCuisineModel.insertMany(restaurantCousines, {
            ordered: true,
            session,
        });
    }

    async find(restaurantId: string): Promise<IRestaurantCuisineDocument[]> {
        const cuisines = await RestaurantCuisineModel.find({ restaurantId }).populate('cuisineId');
        return cuisines;
    }
}
