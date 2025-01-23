import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getMyRestaurantApi,
    getRestaurantsApi,
    searchRestaurantApi,
    updateRestaurantApi,
} from '../../api/apiMethods/restaurant';
import { hotToastMessage } from '../../utils';
import { IResponse, IRestaurant, IRestaurantResponse, IRestaurantsResponse } from '../../types';

export const fetchMyRestaurant = createAsyncThunk<IRestaurantResponse, void, { rejectValue: string }>(
    'restaurant/fetchMyRestaurant',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyRestaurantApi();
            const { restaurant, cuisines } = response.data as IRestaurantResponse;
            return { restaurant, cuisines } as IRestaurantResponse;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const updateMyRestaurant = createAsyncThunk<IRestaurantResponse, FormData, { rejectValue: string }>(
    'restaurant/updateMyRestaurant',
    async (updateData, { rejectWithValue }) => {
        try {
            const updatedData = await updateRestaurantApi(updateData);
            hotToastMessage(updatedData.message, 'success');
            return updatedData.data as IRestaurantResponse;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const fetchRestaurants = createAsyncThunk<
    IRestaurant[],
    {
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
        limit?: number;
    },
    { rejectValue: string | null }
>('menus/fetchRestaurants', async ({ setTotalNumberOfPages, currentPage, limit }, { rejectWithValue }) => {
    try {
        const restaurantsData: IResponse | [] = await getRestaurantsApi(currentPage, limit);

        const data = restaurantsData?.data as IRestaurantsResponse;
        setTotalNumberOfPages(data.numberOfPages);
        return data.restaurants as IRestaurant[];
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});

export const searchRestaurants = createAsyncThunk<
    IRestaurant[],
    {
        searchKey: string;
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
        limit?: number;
    },
    { rejectValue: string | null }
>(
    'menus/searchRestaurants',
    async ({ searchKey, setTotalNumberOfPages, currentPage, limit }, { rejectWithValue }) => {
        try {
            const restaurantsData: IResponse | [] = await searchRestaurantApi(searchKey, currentPage, limit);

            const data = restaurantsData?.data as IRestaurantsResponse;
            setTotalNumberOfPages(data.numberOfPages);
            return data.restaurants as IRestaurant[];
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);
