import { IRestaurant } from '../../types';
import { IRestaurantDocument, RestaurantModel } from '../model';

export class RestaurantRepository {
    async createRestaurant(restaurantData: IRestaurant): Promise<IRestaurantDocument> {
        const restaurant: IRestaurantDocument = await RestaurantModel.create(restaurantData);
        return restaurant;
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
