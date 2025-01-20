import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import dashboardApiUrls from '../urls/dashboard';

export const getRestaurantDashboardApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', dashboardApiUrls.getRestaurantDashboardUrl);
};

export const getAdminDashboardCardApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', dashboardApiUrls.getAdminDashboardCardUrl);
};

export const getAdminDashboardGraphApi = async (year: number): Promise<IResponse> => {
    return await makeApiCall('get', dashboardApiUrls.getAdminDashboardGraphUrl(year));
};
