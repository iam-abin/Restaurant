import makeApiCall from "../apiCalls";
import restaurantApiUrls from "../urls/restaurant";
import { IResponse } from "../../types/api";


export const getARestaurantApi = async (restaurantId: string): Promise<IResponse> => {
	return await makeApiCall("get", restaurantApiUrls.getARestaurantUrl(restaurantId));
};

export const getMyRestaurantApi = async (): Promise<IResponse> => {
	return await makeApiCall("get", restaurantApiUrls.getMyRestaurantUrl);
};

export const updateRestaurantApi = async (data: FormData): Promise<IResponse> => {
	return await makeApiCall("patch", restaurantApiUrls.updateRestaurantUrl, data, true);
};

export const searchRestaurantApi = async (searchText: string, searchQuery: string, selectedCuisines: string[]): Promise<IResponse> => {
	return await makeApiCall("patch", restaurantApiUrls.searchRestaurantUrl(searchText, searchQuery,selectedCuisines));
};
