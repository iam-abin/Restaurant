import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCartItemsApi,
    removeCartItemApi,
    removeCartItemsApi,
    updateQuantityApi,
} from '../../api/apiMethods/cart';
import { hotToastMessage } from '../../utils/hotToast';
import { ICart, ICartItemsData, ICartQuantityUpdate } from '../../types';

export const fetchCartItems = createAsyncThunk<
    ICart[],
    {
        restaurantId: string;
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
        limit?: number;
    },
    { rejectValue: string | null }
>(
    'cart/fetchCartItems',
    async ({ restaurantId, setTotalNumberOfPages, currentPage, limit }, { rejectWithValue }) => {
        try {
            const cart = await getCartItemsApi(restaurantId, currentPage, limit);
            setTotalNumberOfPages((cart.data as ICartItemsData).numberOfPages);
            return (cart.data as ICartItemsData).cartItems;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const changeCartItemQuantity = createAsyncThunk<
    ICartQuantityUpdate,
    ICartQuantityUpdate,
    { rejectValue: string }
>(
    'cart/changeCartItemQuantity',
    async ({ cartItemId, quantity }: ICartQuantityUpdate, { rejectWithValue }) => {
        try {
            const response = await updateQuantityApi(cartItemId, quantity);
            hotToastMessage(response.message, 'success');
            return { cartItemId, quantity };
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const removeCartItem = createAsyncThunk<string, string, { rejectValue: string | null }>(
    'cart/removeCartItem',
    async (cartItemId: string, { rejectWithValue }) => {
        try {
            const response = await removeCartItemApi(cartItemId);
            hotToastMessage(response.message, 'success');
            return cartItemId;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const removeCartItems = createAsyncThunk<never[], void, { rejectValue: string }>(
    'cart/removeCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await removeCartItemsApi();
            hotToastMessage(response.message, 'success');
            return [];
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);
