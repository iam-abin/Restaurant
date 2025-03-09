import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { ICuisineDocument, IRestaurantCuisineDocument, RestaurantCuisineModel } from '../models';
import { IRestaurantCuisine } from '../../types';

@singleton()
export class RestaurantCuisineRepository {
    private readonly excludedFields: string[] = ['-createdAt', '-updatedAt', '-__v'];

    createRestaurant = async (
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
                select: this.excludedFields,
            })
            .select('-_id cuisineId')
            .lean<IRestaurantCuisineDocument[]>();
    };

    findRestaurantCuisine = async (
        restaurantId: string,
        cuisineId: string,
    ): Promise<IRestaurantCuisineDocument | null> => {
        return await RestaurantCuisineModel.findOne({ restaurantId, cuisineId })
            .populate<ICuisineDocument>('cuisineId')
            .lean<IRestaurantCuisineDocument | null>();
    };

    countRestaurantCuisines = async (restaurantId: string): Promise<number> => {
        return await RestaurantCuisineModel.countDocuments({ restaurantId });
    };
}
