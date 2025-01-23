import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils';
import {
    fetchMyRestaurant,
    fetchRestaurants,
    searchRestaurants,
    updateMyRestaurant,
} from '../thunk/restaurantThunk';
import { IRestaurant, IRestaurantResponse } from '../../types';

interface IRestaurantSlice {
    restaurantData: IRestaurantResponse | null;
    restaurantListData: IRestaurant[] | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IRestaurantSlice = {
    restaurantData: null,
    restaurantListData: [],
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
        clearRestaurantList: (state) => {
            state.restaurantListData = [];
        },

        updateRestaurantBlockStatus: (state, action) => {
            const { userId, isBlocked } = action.payload;
            if (state.restaurantListData) {
                state.restaurantListData = state.restaurantListData.map((restaurant) => {
                    if (restaurant.ownerId._id === userId) {
                        return {
                            ...restaurant,
                            ownerId: {
                                ...restaurant.ownerId,
                                isBlocked,
                            },
                        };
                    }
                    return restaurant;
                });
            }
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

        addAsyncThunkCases(builder, fetchRestaurants, (state, action) => {
            state.status = 'succeeded';
            state.restaurantListData = action.payload;
        });

        addAsyncThunkCases(builder, searchRestaurants, (state, action) => {
            state.status = 'succeeded';
            state.restaurantListData = action.payload;
        });
    },
});

export const { clearRestaurant, clearRestaurantList, updateRestaurantBlockStatus } = restaurantSlice.actions;
export default restaurantSlice.reducer;
