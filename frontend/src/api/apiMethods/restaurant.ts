import makeApiCall from '../apiCall';
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
    // console.log("[[[[[[[[[[[[[[[[[data", data);

    return await makeApiCall('patch', restaurantApiUrls.updateRestaurantUrl, data, true);
};

export interface ISearchRestaurantApi {
    searchText: string;
    searchQuery?: string;
    selectedCuisines?: string[];
    page: number;
    limit?: number;
}

export const searchRestaurantApi = async (
    searchText: string,
    page: number,
    limit?: number,
): Promise<IResponse> => {
    return await makeApiCall('get', restaurantApiUrls.searchRestaurantUrl(searchText, page, limit));
};

export const searchFilterRestaurantApi = async ({
    searchText,
    searchQuery,
    selectedCuisines,
    page,
    limit,
}: ISearchRestaurantApi): Promise<IResponse> => {
    return await makeApiCall(
        'get',
        restaurantApiUrls.searchFilterRestaurantUrl({
            searchText,
            searchQuery,
            selectedCuisines,
            page,
            limit,
        }),
    );
};
