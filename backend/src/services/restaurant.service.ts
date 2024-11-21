import { autoInjectable } from 'tsyringe';
import { IRestaurant } from '../types';
import {
    AddressRepository,
    CuisineRepository,
    RestaurantCuisineRepository,
    RestaurantRepository,
    UserRepository,
} from '../database/repository';
import {
    IAddressDocument,
    ICuisineDocument,
    IRestaurantCuisineDocument,
    IRestaurantDocument,
} from '../database/model';
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
        private readonly cuisineRepository: CuisineRepository,
        private readonly restaurantCuisineRepository: RestaurantCuisineRepository,
    ) {}

    public async getARestaurant(restaurantId: string): Promise<IRestaurantDocument | null> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
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

    public async updateRestaurant(
        ownerId: string,
        restaurantData: Partial<Omit<IRestaurant, 'userId' | 'imageUrl'>>,
        file?: Express.Multer.File,
    ): Promise<IRestaurantDocument | null> {
        const { name, city, country, deliveryTime, cuisines } = restaurantData;

        const session = await mongoose.startSession();
        session.startTransaction();
        const parsedCuisines = JSON.parse(cuisines!);

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
            // cusine
            if (parsedCuisines) {
                const existingCuisines: ICuisineDocument[] =
                    await this.cuisineRepository.findArrayItems(parsedCuisines);

                // Filter out cuisines that already exist
                const filteredCuisines: string[] = this.filterOutExistingCuisines(
                    parsedCuisines,
                    existingCuisines,
                );
                const cuisinesToInsert: {
                    name: string;
                }[] = filteredCuisines.map((name: string) => ({ name }));
                if (cuisinesToInsert.length) {
                    const insertedCuisines = await this.cuisineRepository.insertCuisines(
                        cuisinesToInsert,
                        session,
                    );
                    console.log(insertedCuisines, ' insertedCuisines');
                    const restaurantCuisinesToInsert = insertedCuisines.map((cuisine: ICuisineDocument) => ({
                        cuisineId: cuisine._id.toString(),
                        restaurantId: restaurant?._id.toString(),
                    }));

                    await this.restaurantCuisineRepository.insertRestaurantCuisines(
                        restaurantCuisinesToInsert,
                        session,
                    );
                }
            }

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

    private filterOutExistingCuisines(
        newCuisineNames: string[],
        existingCuisineDocuments: ICuisineDocument[],
    ): string[] {
        const existingNames: string[] = existingCuisineDocuments.map(
            (cuisine: ICuisineDocument) => cuisine.name,
        );
        const filteredCuisines: string[] = newCuisineNames.filter(
            (cuisine: string) => !existingNames.includes(cuisine),
        );
        return filteredCuisines;
    }

    public async searchRestaurant(
        searchText: string,
        searchQuery: string,
        selectedCuisines: string,
    ): Promise<any[]> {
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

        const restaurant = await this.restaurantRepository.searchRestaurants(
            searchText,
            searchQuery,
            cuisinesArray,
        );

        return restaurant;
    }
}
