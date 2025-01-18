import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils';
import {
    addToCart,
    changeCartItemQuantity,
    fetchCartItems,
    removeCartItem,
    removeCartItems,
} from '../thunk/cartThunk';
import { ICart } from '../../types';

interface ICartSlice {
    cartData: ICart[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ICartSlice = {
    cartData: [],
    status: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart-data',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartData = [];
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchCartItems, (state, action) => {
            state.status = 'succeeded';
            state.cartData = action.payload;
        });
        addAsyncThunkCases(builder, addToCart, (state, action) => {
            // Remove the item with the given ID from cartData
            state.status = 'succeeded';
            // state.cartData = [...state.cartData, action.payload];
            state.cartData = action.payload;
        });

        addAsyncThunkCases(builder, changeCartItemQuantity, (state, action) => {
            // Remove the item with the given ID from cartData
            state.status = 'succeeded';
            state.cartData = state.cartData.map((item: ICart) =>
                item._id === action.payload.cartItemId
                    ? { ...item, quantity: action.payload.quantity }
                    : item,
            );
        });

        addAsyncThunkCases(builder, removeCartItem, (state, action) => {
            // Remove the item with the given ID from cartData
            state.status = 'succeeded';
            state.cartData = state.cartData.filter((item: ICart) => item._id !== action.payload);
        });

        addAsyncThunkCases(builder, removeCartItems, (state) => {
            // Remove the item with the given ID from cartData
            state.status = 'succeeded';
            state.cartData = [];
        });
    },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
