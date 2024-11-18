import makeApiCall from "../apiCalls";
import restaurantApiUrls from "../urls/restaurant";
import { IResponse } from "../../types/api";
import { IRestaurant } from "../../types";


export const getARestaurantApi = async (restaurantId: string): Promise<IResponse> => {
	return await makeApiCall("get", restaurantApiUrls.getARestaurantUrl(restaurantId));
};

export const getMyRestaurantApi = async (): Promise<IResponse> => {
	return await makeApiCall("get", restaurantApiUrls.getMyRestaurantUrl);
};

export const updateRestaurantApi = async (restaurantId: string, data: Partial<IRestaurant>): Promise<IResponse> => {
	return await makeApiCall("patch", restaurantApiUrls.updateRestaurantUrl(restaurantId), data, true);
};

export const searchRestaurantApi = async (searchText: string, searchQuery: string, selectedCuisines: string[]): Promise<IResponse> => {
	return await makeApiCall("patch", restaurantApiUrls.searchRestaurantUrl(searchText, searchQuery,selectedCuisines));
};
