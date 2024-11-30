import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyRestaurantApi, updateRestaurantApi } from '../../api/apiMethods/restaurant';
import { hotToastMessage } from '../../utils/hotToast';
import { IRestaurantResponse } from '../../types';

// Async thunk for fetching user profile
export const fetchMyRestaurant = createAsyncThunk<
    IRestaurantResponse, // Fulfilled type
    void, // Argument type
    { rejectValue: string } // Rejected value type
>('restaurant/fetchMyRestaurant', async (_, { rejectWithValue }) => {
    try {
        const profile = await getMyRestaurantApi();
        return profile.data as IRestaurantResponse;
    } catch (error: unknown) {
        // Use rejectWithValue to handle errors
        return rejectWithValue((error as Error).message);
    }
});

// Async thunk for updating user profile
export const updateMyRestaurant = createAsyncThunk<
    IRestaurantResponse,
    FormData,
    { rejectValue: string }
>('restaurant/updateMyRestaurant', async (updateData, { rejectWithValue }) => {
    try {
        const updatedData = await updateRestaurantApi(updateData);
        hotToastMessage(updatedData.message, 'success');
        return updatedData.data as IRestaurantResponse; // Ensure the response matches IRestaurant
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});
