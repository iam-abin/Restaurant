import { axiosInstance } from './axiosInstance';
import { hotToastMessage } from '../utils';
import { ApiErrorResponse, IResponse } from '../types/api';
import { AxiosError } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const makeApiCall = async <T>(
    method: HttpMethod,
    url: string,
    data?: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    isFileUpload: boolean = false,
): Promise<IResponse<T>> => {
    try {
        const config = isFileUpload ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await axiosInstance[method](url, data, config);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiErrorResponse;
            if (apiError.errors && apiError.errors.length > 0) {
                throw apiError.errors[0];
            }
        } else {
            hotToastMessage('Something went wrong', 'error');
        }
        throw error;
    }
};

export default makeApiCall;
