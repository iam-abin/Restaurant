import makeApiCall from '../apiCalls';
import { IResponse } from '../../types/api';
import orderApiUrls from '../urls/order';

export const checkoutOrderApi = async (): Promise<IResponse> => {
    return await makeApiCall('post', orderApiUrls.checkoutOrderUrl);
};

export const getMyOrdersApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', orderApiUrls.getMyOrdersUrl);
};

export const getRestaurantOrdersApi = async (restaurantId: string): Promise<IResponse> => {
    return await makeApiCall('get', orderApiUrls.getRestaurantOrdersUrl(restaurantId));
};

export const updateOrderStatusApi = async (orderId: string, status: string): Promise<IResponse> => {
    return await makeApiCall('post', orderApiUrls.updateOrderStatusUrl(orderId), {
        status
    });
};
