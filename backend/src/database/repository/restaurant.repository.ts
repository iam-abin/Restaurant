import { IRestaurant } from '../../types';
import { IRestaurantDocument, RestaurantModel } from '../model';

export class RestaurantRepository {
    async create(restaurantData: Pick<IRestaurant, "ownerId">): Promise<IRestaurantDocument> {
        const restaurant: IRestaurantDocument = await RestaurantModel.create(restaurantData);
        return restaurant;
    }

    async findRestaurant(restaurantId: string): Promise<IRestaurantDocument | null> {
        return await RestaurantModel.findById(restaurantId);
    }

    async findMyRestaurant(userId: string): Promise<IRestaurantDocument | null> {
        return await RestaurantModel.findOne({ userId });
    }

    async update(
        ownerId: string,
        updatedData: Partial<IRestaurant>,
    ): Promise<IRestaurantDocument | null> {
        const restaurant: IRestaurantDocument | null = await RestaurantModel.findOneAndUpdate(
            {userId: ownerId},
            updatedData,
            {
                new: true,
            },
        );
        return restaurant;
    }
}
