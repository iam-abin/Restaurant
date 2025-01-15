import { ISearchRestaurantApi } from '../apiMethods/restaurant';

const RESTAURANT_URL = '/restaurant';

const restaurantApiUrls = {
    getARestaurantUrl: (restaurantId: string) => `${RESTAURANT_URL}/${restaurantId}`,
    getMyRestaurantUrl: `${RESTAURANT_URL}`,
    getRestaurantsUrl: (page: number, limit?: number) =>
        `${RESTAURANT_URL}/restaurants?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    updateRestaurantUrl: `${RESTAURANT_URL}`,
    searchRestaurantUrl: (searchText: string, page: number, limit?: number) =>
        `${RESTAURANT_URL}/search?searchText=${searchText ?? ''}&page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    searchFilterRestaurantUrl: ({
        searchText,
        searchQuery,
        selectedCuisines,
        page,
        limit,
    }: ISearchRestaurantApi): string =>
        `${RESTAURANT_URL}/search-filter?searchText=${searchText ?? ''}&searchQuery=${searchQuery ?? ''}&selectedCuisines=${selectedCuisines}&page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
};

export default restaurantApiUrls;
