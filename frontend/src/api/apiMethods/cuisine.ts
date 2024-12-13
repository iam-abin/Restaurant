import { IResponse } from "../../types/api";
import makeApiCall from "../apiCalls";
import cuisineApiUrls from "../urls/cuisine";

export const searchCuisineApi = async (searchText?: string): Promise<IResponse> => {
    return await makeApiCall('get', cuisineApiUrls.searchCuisineUrl(searchText));
};