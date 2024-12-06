import makeApiCall from '../apiCalls';
import restaurantApiUrls from '../urls/restaurant';
import { IResponse } from '../../types/api';

export const getARestaurantApi = async (restaurantId: string): Promise<IResponse> => {
    return await makeApiCall('get', restaurantApiUrls.getARestaurantUrl(restaurantId));
};

export const getMyRestaurantApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', restaurantApiUrls.getMyRestaurantUrl);
};

export const getRestaurantsApi = async (page: number, limit: number): Promise<IResponse> => {
    return await makeApiCall('get', restaurantApiUrls.getRestaurantsUrl(page, limit));
};

export const updateRestaurantApi = async (data: FormData): Promise<IResponse> => {
    return await makeApiCall('patch', restaurantApiUrls.updateRestaurantUrl, data, true);
};

export interface ISearchRestaurantApi {
    searchText: string;
    searchQuery?: string;
    selectedCuisines?: string[];
}
export const searchRestaurantApi = async ({
    searchText,
    searchQuery,
    selectedCuisines,
}: ISearchRestaurantApi): Promise<IResponse> => {
    return await makeApiCall(
        'get',
        restaurantApiUrls.searchRestaurantUrl({ searchText, searchQuery, selectedCuisines }),
    );
};