import { autoInjectable } from 'tsyringe';
import { IRestaurant } from '../types';
import { RestaurantRepository } from '../database/repository';
import { IRestaurantDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';

@autoInjectable()
export class RestaurantService {
    constructor(private readonly restaurantRepository: RestaurantRepository) {}

    public async createRestaurant(
        userId: string,
        restaurantData: Omit<IRestaurant, 'userId' | 'imageUrl'>,
        file: Express.Multer.File,
    ): Promise<IRestaurantDocument | null> {
        const imageUrl = await uploadImageOnCloudinary(file);

        const restaurant: IRestaurantDocument | null = await this.restaurantRepository.createRestaurant({
            ...restaurantData,
            userId,
            imageUrl,
        });

        return restaurant;
    }
}
