import { autoInjectable } from 'tsyringe';
import {
    IRestaurantResult,
    IRestaurantsData,
    IRestaurantUpdate,
    IRestaurantWithCuisines,
    SearchFilterData,
    SearchRestaurant,
    SearchFilterResult,
    ISearchRestaurantData,
} from '../types';
import {
    AddressRepository,
    CartRepository,
    RatingRepository,
    RestaurantCuisineRepository,
    RestaurantRepository,
    UserRepository,
} from '../database/repositories';
import {
    IAddressDocument,
    IRatingDocument,
    IRestaurantCuisineDocument,
    IRestaurantDocument,
} from '../database/models';
import {
    executeTransaction,
    getPaginationSkipValue,
    getPaginationTotalNumberOfPages,
    uploadImageOnCloudinary,
} from '../utils';
import { NotFoundError } from '../errors';

@autoInjectable()
export class RestaurantService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly addressRepository: AddressRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly restaurantCuisineRepository: RestaurantCuisineRepository,
        private readonly ratingRepository: RatingRepository,
        private readonly cartRepository: CartRepository,
    ) {}

    public getARestaurant = async (
        restaurantId: string,
        userId: string,
    ): Promise<IRestaurantResult | null> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurantById(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');

        const [restaurantCuisines, restaurantRating, restaurantRatingsCount, myRating, cartItemsCount]: [
            IRestaurantCuisineDocument[],
            number,
            number,
            IRatingDocument | null,
            number,
        ] = await Promise.all([
            this.restaurantCuisineRepository.findRestaurantCuisines(restaurantId),
            this.ratingRepository.findRestaurantRating(restaurantId),
            this.ratingRepository.countRestaurantRatings(restaurant._id.toString()),
            this.ratingRepository.findUserRating(restaurant._id.toString(), userId),
            this.cartRepository.countCartItems(restaurantId, userId),
        ]);

        return {
            restaurant,
            restaurantCuisines,
            restaurantRating,
            restaurantRatingsCount,
            myRating: myRating ? myRating.rating : 0,
            cartItemsCount,
        };
    };

    public getMyRestaurant = async (userId: string): Promise<IRestaurantWithCuisines> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurantByOwnerId(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');

        const [cuisines, restaurantRating, restaurantRatingsCount]: [
            IRestaurantCuisineDocument[],
            number,
            number,
        ] = await Promise.all([
            this.restaurantCuisineRepository.findRestaurantCuisines(restaurant._id.toString()),
            this.ratingRepository.findRestaurantRating(restaurant._id.toString()),
            this.ratingRepository.countRestaurantRatings(restaurant._id.toString()),
        ]);
        return { restaurant, cuisines, restaurantRating, restaurantRatingsCount };
    };

    public getRestaurants = async (page: number, limit: number): Promise<IRestaurantsData> => {
        const skip: number = getPaginationSkipValue(page, limit);

        const [restaurants, restaurantsCount]: [IRestaurantDocument[], number] = await Promise.all([
            this.restaurantRepository.findRestaurants(skip, limit),
            this.restaurantRepository.countRestaurants(),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(restaurantsCount, limit);

        return { restaurants, numberOfPages };
    };

    public updateRestaurant = async (
        ownerId: string,
        restaurantData: IRestaurantUpdate,
        file?: Express.Multer.File,
    ): Promise<IRestaurantDocument | null> => {
        const { name, phone, city, country, deliveryTime } = restaurantData;

        return executeTransaction(async (session) => {
            // user
            await this.userRepository.updateUser(ownerId, { name, phone }, session);
            // address
            const addressData: IAddressDocument | null = await this.addressRepository.updateAddress(
                ownerId,
                { userId: ownerId, city, country },
                session,
            );

            // resturant
            let imageUrl: string | undefined;
            if (file) {
                imageUrl = await uploadImageOnCloudinary(file);
            }

            const restaurant: IRestaurantDocument | null = await this.restaurantRepository.updateRestaurant(
                ownerId,
                { addressId: addressData?._id.toString(), deliveryTime, imageUrl },
                session,
            );

            return restaurant;
        });
    };

    public searchRestaurantByName = async (
        searchText: string,
        page: number,
        limit: number,
    ): Promise<ISearchRestaurantData> => {
        const skip: number = getPaginationSkipValue(page, limit);

        const { restaurants, totalCount } = await this.restaurantRepository.searchRestaurantByName(
            searchText,
            skip,
            limit,
        );

        const numberOfPages: number = getPaginationTotalNumberOfPages(totalCount, limit);
        return { restaurants, numberOfPages };
    };

    public searchFilterRestaurant = async ({
        searchText,
        searchQuery,
        selectedCuisines,
        page,
        limit,
    }: SearchRestaurant): Promise<SearchFilterData> => {
        const skip: number = getPaginationSkipValue(page, limit);

        let cuisinesArray: string[] = selectedCuisines.split(',');
        if (cuisinesArray.length) {
            cuisinesArray = cuisinesArray.filter((cuisine: string) => cuisine); // It avoid falsy values
        }

        const restaurantSearchResult: SearchFilterResult = await this.restaurantRepository.searchRestaurants(
            searchText,
            searchQuery,
            cuisinesArray,
            skip,
            limit,
        );

        const numberOfPages: number = getPaginationTotalNumberOfPages(
            restaurantSearchResult.totalCount,
            limit,
        );
        return { restaurants: restaurantSearchResult.restaurants, numberOfPages };
    };
}
