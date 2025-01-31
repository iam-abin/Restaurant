import { IResponse } from '../../types/api';
import makeApiCall from '../apiCall';
import cuisineApiUrls from '../urls/cuisine';

export const getCuisinesApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', cuisineApiUrls.getCuisinesUrl);
};

export const searchCuisineApi = async (searchText?: string): Promise<IResponse> => {
    return await makeApiCall('get', cuisineApiUrls.searchCuisineUrl(searchText));
};
