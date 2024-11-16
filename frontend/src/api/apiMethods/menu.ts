import makeApiCall from "../apiCalls";
import { IResponse } from "../../types/api";
import menuApiUrls from "../urls/menu";


export const addMenuApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", menuApiUrls.addMenuUrl, data);
};

export const getMenuApi = async (menuId: string): Promise<IResponse> => {
    return await makeApiCall("get", menuApiUrls.getMenuUrl(menuId));
};

export const getMenusApi = async (restaurantId: string): Promise<IResponse> => {
    return await makeApiCall("get", menuApiUrls.getMenusUrl(restaurantId));
};

export const editMenuApi = async (menuId: string, data: any): Promise<IResponse> => {
    return await makeApiCall("patch", menuApiUrls.editMenuUrl(menuId), data);
};