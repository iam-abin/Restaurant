import { ISearchRestaurantApi } from '../apiMethods/restaurant';

const RESTAURANT_URL = `/restaurant`;

const restaurantApiUrls = {
    getARestaurantUrl: (restaurantId: string) => `${RESTAURANT_URL}/${restaurantId}`,
    getMyRestaurantUrl: `${RESTAURANT_URL}`,
    getRestaurantsUrl: `${RESTAURANT_URL}/restaurants`,
    updateRestaurantUrl: `${RESTAURANT_URL}`,
    searchRestaurantUrl: ({ searchText, searchQuery, selectedCuisines }: ISearchRestaurantApi): string =>
        `${RESTAURANT_URL}/search/${searchText}?searchQuery=${searchQuery}&selectedCuisines=${selectedCuisines}`,
};

export default restaurantApiUrls;
