import makeApiCall from "../apiCalls";
import restaurantApiUrls from "../urls/restaurant";
import { IResponse } from "../../types/api";


export const getARestaurantApi = async (restaurantId: string): Promise<IResponse> => {
	return await makeApiCall("get", restaurantApiUrls.getARestaurantUrl(restaurantId));
};

export const getMyRestaurantApi = async (): Promise<IResponse> => {
	return await makeApiCall("get", restaurantApiUrls.getMyRestaurantUrl);
};

export const editRestaurantApi = async (restaurantId: string, data: any): Promise<IResponse> => {
	return await makeApiCall("patch", restaurantApiUrls.editRestaurantUrl(restaurantId), data);
};
