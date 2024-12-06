import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    addToCartApi,
    getCartItemsApi,
    removeCartItemApi,
    removeCartItemsApi,
    updateQuantityApi,
} from '../../api/apiMethods/cart';
import { hotToastMessage } from '../../utils/hotToast';
import { ICartQuantityUpdate, ICartResponse } from '../../types';

// Async thunk for fetching user cart
export const fetchCartItems = createAsyncThunk<ICartResponse[], string, { rejectValue: string }>(
    'cart/fetchCartItems',
    async (restaurantId: string, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            const cart = await getCartItemsApi(restaurantId);
            return cart.data as ICartResponse[];
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const addToCart = createAsyncThunk<
    ICartResponse[], // The type of the resolved value (e.g., cart data)
    { itemId: string; restaurantId: string }, // The argument type
    { rejectValue: string } // The thunk API config
>(
    'cart/addToCart',
    async ({ itemId, restaurantId }: { itemId: string; restaurantId: string }, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            const cart = await addToCartApi(itemId, restaurantId);
            console.log(cart, 'inside addToCartThunk');
            hotToastMessage(cart.message, 'success');
            const cartItems = await getCartItemsApi(restaurantId);
            return cartItems.data as ICartResponse[];
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// Async thunk for updating user cart
export const changeCartItemQuantity = createAsyncThunk<
    ICartQuantityUpdate, // Resolved value type
    ICartQuantityUpdate, // Argument type
    { rejectValue: string } // Thunk config with rejectValue type
>(
    'cart/changeCartItemQuantity',
    async ({ cartItemId, quantity }: ICartQuantityUpdate, { rejectWithValue }) => {
        try {
            const response = await updateQuantityApi(cartItemId, quantity); // API call to remove item
            hotToastMessage(response.message, 'success');
            return { cartItemId, quantity }; // Return the ID of the removed item
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// Async thunk for updating user cart
export const removeCartItem = createAsyncThunk<
    string, // Resolved value type (string is returned)
    string, // Argument type (cartItemId is a string)
    { rejectValue: string | null } // Thunk config with rejectValue type
>('cart/removeCartItem', async (cartItemId: string, { rejectWithValue }) => {
    try {
        const response = await removeCartItemApi(cartItemId); // API call to remove item
        hotToastMessage(response.message, 'success');
        return cartItemId; // Return the ID of the removed item
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});

// Async thunk for updating user cart
export const removeCartItems = createAsyncThunk<
    never[], // Return type
    void, // Argument type
    { rejectValue: string } // Thunk API config
>('cart/removeCartItems', async (_, { rejectWithValue }) => {
    try {
        const response = await removeCartItemsApi();
        hotToastMessage(response.message, 'success');
        return [];
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});
