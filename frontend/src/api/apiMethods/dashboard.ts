import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import dashboardApiUrls from '../urls/dashboard';

export const getRestaurantDashboardApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', dashboardApiUrls.getRestaurantDashboardUrl);
};

export const getAdminDashboardApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', dashboardApiUrls.getAdminDashboardUrl);
};
