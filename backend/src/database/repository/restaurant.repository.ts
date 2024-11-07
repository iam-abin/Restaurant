import { IRestaurant } from '../../types';
import { IRestaurantDocument, RestaurantModel } from '../model';

export class RestaurantRepository {
    async createRestaurant(restaurantData: IRestaurant): Promise<IRestaurantDocument> {
        const restaurant: IRestaurantDocument = await RestaurantModel.create(restaurantData);
        return restaurant;
    }

    async findRestaurant(restaurantId: string): Promise<IRestaurantDocument | null> {
        return await RestaurantModel.findById(restaurantId);
    }

    async findMyRestaurant(userId: string): Promise<IRestaurantDocument | null> {
        return await RestaurantModel.findOne({ userId });
    }

    async updateRestaurant(
        restaurantId: string,
        updatedData: Partial<IRestaurant>,
    ): Promise<IRestaurantDocument | null> {
        const restaurant: IRestaurantDocument | null = await RestaurantModel.findByIdAndUpdate(
            restaurantId,
            updatedData,
            {
                new: true,
            },
        );
        return restaurant;
    }
}
