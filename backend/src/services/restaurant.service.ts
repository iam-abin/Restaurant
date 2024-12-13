import { autoInjectable } from 'tsyringe';
import { IRestaurantResponse, IRestaurantsData, IRestaurantUpdate, ISearchResult } from '../types';
import {
    AddressRepository,
    CuisineRepository,
    RestaurantCuisineRepository,
    RestaurantRepository,
    UserRepository,
} from '../database/repository';
import { IAddressDocument, IRestaurantCuisineDocument, IRestaurantDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';
import { NotFoundError } from '../errors';
import mongoose from 'mongoose';
import { RestaurantWithCuisines } from '../controllers/restaurant.controller';

@autoInjectable()
export class RestaurantService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly addressRepository: AddressRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly restaurantCuisineRepository: RestaurantCuisineRepository,
    ) {}

    public async getARestaurant(restaurantId: string): Promise<IRestaurantResponse | null> {
        const restaurant: IRestaurantResponse | null =
            await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        return restaurant;
    }

    public async getMyRestaurant(userId: string): Promise<RestaurantWithCuisines> {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findMyRestaurant(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        const cuisines: IRestaurantCuisineDocument[] = await this.restaurantCuisineRepository.find(
            restaurant?._id.toString(),
        );
        return { restaurant, cuisines };
    }

    public async getRestaurants(page: number, limit: number): Promise<IRestaurantsData> {
        const skip: number = (page - 1) * limit;
        const restaurants: IRestaurantDocument[] = await this.restaurantRepository.findRestaurants(
            skip,
            limit,
        );
        const restaurantsCount: number = await this.restaurantRepository.countRestaurants();
        const numberOfPages: number = Math.ceil(restaurantsCount / limit);
        return { restaurants, numberOfPages };
    }

    public async updateRestaurant(
        ownerId: string,
        restaurantData: IRestaurantUpdate,
        file?: Express.Multer.File,
    ): Promise<IRestaurantDocument | null> {
        const { name, city, country, deliveryTime } = restaurantData;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // user
            await this.userRepository.updateUser(ownerId, { name }, session);
            // address
            const addressData: IAddressDocument | null = await this.addressRepository.update(
                ownerId,
                { userId: ownerId, city, country },
                session,
            );

            // resturant
            let imageUrl: string | undefined;
            if (file) {
                imageUrl = await uploadImageOnCloudinary(file);
            }

            const restaurant: IRestaurantDocument | null = await this.restaurantRepository.update(
                ownerId,
                { addressId: addressData?._id.toString(), deliveryTime, imageUrl },
                session,
            );

            // Commit the transaction
            await session.commitTransaction();
            return restaurant;
        } catch (error) {
            // Rollback the transaction if something goes wrong
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    public async searchRestaurant(
        searchText: string,
        searchQuery: string,
        selectedCuisines: string,
    ): Promise<ISearchResult[]> {
        // search is based on ( name, city, country, cuisines )

        // console.log('-------------------');
        // console.log(
        //     'searchText==> ',
        //     searchText,
        //     'searchQuery==> ',
        //     searchQuery,
        //     'selectedCuisines==> ',
        //     selectedCuisines,
        // );
        // console.log('-------------------');
        let cuisinesArray: string[] = selectedCuisines.split(',');
        if (cuisinesArray.length) {
            cuisinesArray = cuisinesArray.filter((cuisine: string) => cuisine); // It avoid falsy values
            console.log(cuisinesArray, ' cuisinesArray');
            console.log(cuisinesArray.length, ' cuisinesArray');
        }

        // const cuisinesArray: string[] = selectedCuisines.split(', ').filter((cuisine: string) => cuisine); // It avoid falsy values

        const restaurant: ISearchResult[] = await this.restaurantRepository.searchRestaurants(
            searchText,
            searchQuery,
            cuisinesArray,
        );

        return restaurant;
    }
}
