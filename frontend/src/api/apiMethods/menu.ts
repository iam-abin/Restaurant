import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import menuApiUrls from '../urls/menu';
import { IMenu } from '../../types';

export const addMenuItemApi = async (data: Omit<IMenu, '_id'>): Promise<IResponse> => {
    return await makeApiCall('post', menuApiUrls.addMenuItemUrl, data);
};

export const getMenuItemApi = async (menuItemId: string): Promise<IResponse> => {
    return await makeApiCall('get', menuApiUrls.getMenuItemUrl(menuItemId));
};

export const getMenuApi = async (restaurantId: string, page: number, limit?: number): Promise<IResponse> => {
    return await makeApiCall('get', menuApiUrls.getMenuUrl(restaurantId, page, limit));
};

export const editMenuItemApi = async (menuId: string, data: Partial<IMenu>): Promise<IResponse> => {
    return await makeApiCall('patch', menuApiUrls.editMenuItemUrl(menuId), data);
};

export const closeOpenMenuItemApi = async (menuItemId: string): Promise<IResponse> => {
    return await makeApiCall('patch', menuApiUrls.closeOpenMenuItemUrl(menuItemId));
};
