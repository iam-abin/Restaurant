import { autoInjectable } from 'tsyringe';
import { IRestaurant } from '../types';
import { RestaurantRepository } from '../database/repository';
import { IRestaurantDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';
import { ForbiddenError, NotFoundError } from '../errors';

@autoInjectable()
export class RestaurantService {
    constructor(private readonly restaurantRepository: RestaurantRepository) {}

    public async createRestaurant(
        userId: string,
        restaurantData: Omit<IRestaurant, 'userId' | 'imageUrl'>,
        file: Express.Multer.File,
    ): Promise<IRestaurantDocument> {
        const imageUrl = await uploadImageOnCloudinary(file);

        const restaurant: IRestaurantDocument = await this.restaurantRepository.createRestaurant({
            ...restaurantData,
            userId,
            imageUrl,
        });

        return restaurant;
    }

    public async getARestaurant(restaurantId: string): Promise<IRestaurantDocument | null> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        
        return restaurant;
    }

    public async getMyRestaurant(userId: string): Promise<IRestaurantDocument | null> {
        const restaurant = await this.restaurantRepository.findMyRestaurant(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        if (userId !== restaurant?.userId.toString())
            throw new ForbiddenError('You cannot access others restaurant');
        return restaurant;
    }
}
