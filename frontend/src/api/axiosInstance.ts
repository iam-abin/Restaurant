import axios, { AxiosError } from 'axios';
import { BASE_URL_BACKEND } from '../constants';
import { hotToastMessage } from '../utils';

export const axiosInstance = axios.create({
    baseURL: BASE_URL_BACKEND,
    withCredentials: true,
});

import { store } from '../redux/store'; // Import your Redux store
import { resetAuth } from '../redux/slice/authSlice'; // Import an action to reset auth state
import { clearProfile } from '../redux/slice/profileSlice';
import { clearMenus } from '../redux/slice/menusSlice';
import { clearCart } from '../redux/slice/cartSlice';
import { clearRestaurant } from '../redux/slice/restaurantSlice';
import { clearAdminDashboard } from '../redux/slice/dashboardSlice';
import { ApiErrorResponse } from '../types';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean; // Add the _retry property as optional
    }
}

const clearAllState = (): void => {
    store.dispatch(resetAuth()); // Reset auth state in Redux
    // User
    store.dispatch(clearProfile());
    store.dispatch(clearMenus());
    store.dispatch(clearCart());

    // Restaurant
    store.dispatch(clearRestaurant());
    store.dispatch(clearMenus());
    // Admin
    store.dispatch(clearAdminDashboard());
};

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // If the response status is 401, attempt token refresh
        if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
            // To prevent infinite loop
            originalRequest._retry = true;

            try {
                // Call the refresh token endpoint and sets the cookies
                await axiosInstance.post('/auth/refresh', null, { withCredentials: true });
                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError: unknown) {
                if (refreshError instanceof AxiosError && refreshError.response?.data) {
                    const apiError = refreshError.response.data as ApiErrorResponse;
                    if (apiError.errors && apiError.errors.length > 0) {
                        hotToastMessage(apiError.errors[0].message, 'error');
                    }
                } else {
                    hotToastMessage('Token refresh failed due to an unknown error', 'error');
                }

                clearAllState();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);
