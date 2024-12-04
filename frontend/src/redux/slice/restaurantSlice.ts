import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils/addCase';
import { fetchMyRestaurant, updateMyRestaurant } from '../thunk/restaurantThunk';
import { IRestaurantResponse } from '../../types';

interface IRestaurantSlice {
    restaurantData: IRestaurantResponse | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IRestaurantSlice = {
    restaurantData: null,
    status: 'idle',
    error: null,
};

const restaurantSlice = createSlice({
    name: 'restaurant-data',
    initialState,
    reducers: {
        clearRestaurant: (state) => {
            state.restaurantData = null;
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchMyRestaurant, (state, action) => {
            state.status = 'succeeded';
            state.restaurantData = action.payload;
        });
        addAsyncThunkCases(builder, updateMyRestaurant, (state, action) => {
            state.status = 'succeeded';
            state.restaurantData = action.payload;
        });
    },
});

export const { clearRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
