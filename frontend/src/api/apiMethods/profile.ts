import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import profileApiUrls from '../urls/profile';
import { ProfileUpdate } from '../../types';

export const getProfileApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', profileApiUrls.getProfileUrl);
};

export const getProfilesApi = async (page: number, limit?: number): Promise<IResponse> => {
    return await makeApiCall('get', profileApiUrls.getProfilesUrl(page, limit));
};

export const searchProfileApi = async (
    searchKey: string,
    page: number,
    limit?: number,
): Promise<IResponse> => {
    return await makeApiCall('get', profileApiUrls.searchProfileUrl(searchKey, page, limit));
};

export const updateProfileApi = async (updateData: ProfileUpdate): Promise<IResponse> => {
    return await makeApiCall('patch', profileApiUrls.updateProfileUrl, updateData);
};
