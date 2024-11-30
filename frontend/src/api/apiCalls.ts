import { axiosInstance } from './axiosInstance';
import { hotToastMessage } from '../utils/hotToast';
import { IResponse } from '../types/api';
import { AxiosError } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface ApiErrorResponse {
    errors?: Array<{ message: string }>;
}

const makeApiCall = async <T>(
    method: HttpMethod,
    url: string,
    data?: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    isFileUpload: boolean = false
): Promise<IResponse<T>> => {
    try {
        const config = isFileUpload ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await axiosInstance[method](url, data, config);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data as ApiErrorResponse;
            if (apiError.errors && apiError.errors.length > 0) {
                hotToastMessage(apiError.errors[0].message, 'error');
            } else {
                hotToastMessage('Something went wrong', 'error');
            }
        } else {
            hotToastMessage('An unexpected error occurred', 'error');
        }
        throw error;
    }
};

export default makeApiCall;
