import makeApiCall from '../apiCall';
import { IResponse } from '../../types/api';
import ratingApiUrls from '../urls/rating';

export const changeRatingApi = async (ratingData: {
    restaurantId: string;
    rating: number;
}): Promise<IResponse> => {
    console.log(ratingData);

    return await makeApiCall('post', ratingApiUrls.changeRatingUrl, ratingData);
};
