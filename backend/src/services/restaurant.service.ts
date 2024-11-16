import { autoInjectable } from 'tsyringe';
import { IRestaurant } from '../types';
import { RestaurantRepository } from '../database/repository';
import { IRestaurantDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';
import { NotFoundError } from '../errors';

@autoInjectable()
export class RestaurantService {
    constructor(private readonly restaurantRepository: RestaurantRepository) {}

    public async getARestaurant(restaurantId: string): Promise<IRestaurantDocument | null> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        return restaurant;
    }

    public async getMyRestaurant(userId: string): Promise<IRestaurantDocument | null> {
        const restaurant = await this.restaurantRepository.findMyRestaurant(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        return restaurant;
    }

    public async updateRestaurant(
        ownerId: string,
        restaurantData: Partial<Omit<IRestaurant, 'userId' | 'imageUrl'>>,
        file?: Express.Multer.File,
    ): Promise<IRestaurantDocument | null> {
        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await uploadImageOnCloudinary(file);
        }

        const restaurant: IRestaurantDocument | null = await this.restaurantRepository.update(ownerId, {
            ...restaurantData,
            imageUrl,
        });

        return restaurant;
    }

    public async searchRestaurant(
        searchText: string,
        searchQuery: string,
        selectedCuisines: string,
    ): Promise<any[]> {
        // search is based on ( name, city, country, cuisines )

        const cuisinesArray: string[] = selectedCuisines.split(', ').filter((cuisine: string) => cuisine); // It avoid falsy values

        const restaurant = await this.restaurantRepository.searchRestaurants(
            searchText,
            searchQuery,
            cuisinesArray,
        );

        return restaurant;
    }
}
