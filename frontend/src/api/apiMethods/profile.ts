import makeApiCall from '../apiCalls';
import { IResponse } from '../../types/api';
import profileApiUrls from '../urls/profile';
import { ProfileUpdate } from '../../types';

export const getProfileApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', profileApiUrls.getProfileUrl);
};

export const getProfilesApi = async (): Promise<IResponse> => {
    return await makeApiCall('get', profileApiUrls.getProfilesUrl);
};

export const updateProfileApi = async (updateData: ProfileUpdate): Promise<IResponse> => {
    return await makeApiCall('patch', profileApiUrls.updateProfileUrl, updateData);
};
