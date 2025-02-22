import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import cartApiUrls from '../urls/cart';

export const addToCartApi = async (itemId: string, restaurantId: string): Promise<IResponse> => {
    return await makeApiCall('post', cartApiUrls.addToCartUrl, { itemId, restaurantId });
};

export const getCartItemsApi = async (
    restaurantId: string,
    page: number,
    limit?: number,
): Promise<IResponse> => {
    return await makeApiCall('get', cartApiUrls.getCartItemsUrl(restaurantId, page, limit));
};

export const updateQuantityApi = async (cartItemId: string, quantity: number): Promise<IResponse> => {
    return await makeApiCall('patch', cartApiUrls.updateQuantityUrl(cartItemId), { quantity });
};

export const removeCartItemsApi = async (): Promise<IResponse> => {
    return await makeApiCall('delete', cartApiUrls.removeCartItemsUrl);
};

export const removeCartItemApi = async (cartItemId: string): Promise<IResponse> => {
    return await makeApiCall('delete', cartApiUrls.removeCartItemUrl(cartItemId));
};
