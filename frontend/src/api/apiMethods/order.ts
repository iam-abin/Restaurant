import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import orderApiUrls from '../urls/order';

export const checkoutOrderApi = async (orderData: { restaurantId: string }): Promise<IResponse> => {
    return await makeApiCall('post', orderApiUrls.checkoutOrderUrl, orderData);
};

export const getMyOrdersApi = async (currentPage: number, limit?: number): Promise<IResponse> => {
    return await makeApiCall('get', orderApiUrls.getMyOrdersUrl(currentPage, limit));
};

export const getRestaurantOrdersApi = async (
    restaurantId: string,
    currentPage: number,
    limit?: number,
): Promise<IResponse> => {
    return await makeApiCall('get', orderApiUrls.getRestaurantOrdersUrl(restaurantId, currentPage, limit));
};

export const updateOrderStatusApi = async (orderId: string, status: string): Promise<IResponse> => {
    return await makeApiCall('patch', orderApiUrls.updateOrderStatusUrl(orderId), {
        status,
    });
};
