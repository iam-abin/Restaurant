import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import menuApiUrls from '../urls/menu';
import { IMenu } from '../../types';

export const addMenuApi = async (data: Omit<IMenu, '_id'>): Promise<IResponse> => {
    return await makeApiCall('post', menuApiUrls.addMenuUrl, data);
};

export const getMenuApi = async (menuId: string): Promise<IResponse> => {
    return await makeApiCall('get', menuApiUrls.getMenuUrl(menuId));
};

export const getMenusApi = async (restaurantId: string, page: number, limit?: number): Promise<IResponse> => {
    return await makeApiCall('get', menuApiUrls.getMenusUrl(restaurantId, page, limit));
};

export const editMenuApi = async (menuId: string, data: Partial<IMenu>): Promise<IResponse> => {
    return await makeApiCall('patch', menuApiUrls.editMenuUrl(menuId), data);
};
