import axios, { AxiosError } from 'axios';
import { BASE_URL_BACKEND } from '../utils/constants';

export const axiosInstance = axios.create({
    baseURL: BASE_URL_BACKEND,
    withCredentials: true,
});

// import { store } from '../redux/store'; // Import your Redux store
// import { resetAuth } from '../redux/slice/authSlice'; // Import an action to reset auth state

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean; // Add the _retry property as optional
    }
}

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // If the response status is 401, attempt token refresh
        if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
            // Prevent infinite loop
            originalRequest._retry = true;

            try {
                // Call the refresh token endpoint
                await axiosInstance.post('/auth/refresh', null, { withCredentials: true });
                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        // Reject other errors

        if (originalRequest?._retry) {
            // Clear auth state in Redux
            //  store.dispatch(resetAuth()); // Reset the auth state (clears authData)
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    },
);
