import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils';
import { IRestaurantOrder } from '../../types';
import { fetchRestaurantOrders } from '../thunk/orderThunk';

interface IOrderSlice {
    restaurantOrdersList: IRestaurantOrder[] | [];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IOrderSlice = {
    restaurantOrdersList: [],
    status: 'idle',
    error: null,
};

const orderSlice = createSlice({
    name: 'order-data',
    initialState,
    reducers: {
        clearOrder: (state) => {
            state.restaurantOrdersList = [];
        },
        clearRestaurantOrdersList: (state) => {
            state.restaurantOrdersList = [];
        },

        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;

            if (state.restaurantOrdersList) {
                state.restaurantOrdersList = state.restaurantOrdersList.map((order) => {
                    if (order._id === orderId) {
                        return {
                            ...order,
                            status,
                        };
                    }
                    return order;
                });
            }
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchRestaurantOrders, (state, action) => {
            state.status = 'succeeded';
            state.restaurantOrdersList = action.payload;
        });
    },
});

export const { clearRestaurantOrdersList, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
