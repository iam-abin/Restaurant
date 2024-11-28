import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    addToCartApi,
    getCartItemsApi,
    removeCartItemApi,
    removeCartItemsApi,
    updateQuantityApi
} from '../../api/apiMethods/cart'
import { hotToastMessage } from '../../utils/hotToast'

// Async thunk for fetching user cart
export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (restaurantId: string, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            const cart = await getCartItemsApi(restaurantId)
            return cart.data
        } catch (error) {
            return rejectWithValue('Failed to fetch cart')
        }
    }
)

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({itemId, restaurantId}:{ itemId: string, restaurantId: string}, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            const cart = await addToCartApi(itemId, restaurantId)
            hotToastMessage(cart.message, 'success')
            return cart.data
        } catch (error) {
            return rejectWithValue('Failed to fetch cart')
        }
    }
)

// Async thunk for updating user cart
export const changeCartItemQuantity = createAsyncThunk(
    'cart/changeCartItemQuantity',
    async (
        { cartItemId, quantity }: { cartItemId: string; quantity: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await updateQuantityApi(cartItemId, quantity) // API call to remove item
            hotToastMessage(response.message, 'success')
            return { cartItemId, quantity } // Return the ID of the removed item
        } catch (error) {
            return rejectWithValue('Failed to remove cart item')
        }
    }
)

// Async thunk for updating user cart
export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (cartItemId: string, { rejectWithValue }) => {
        try {
            const response = await removeCartItemApi(cartItemId) // API call to remove item
            hotToastMessage(response.message, 'success')
            return cartItemId // Return the ID of the removed item
        } catch (error) {
            return rejectWithValue('Failed to remove cart item')
        }
    }
)

// Async thunk for updating user cart
export const removeCartItems = createAsyncThunk(
    'cart/removeCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await removeCartItemsApi()
            hotToastMessage(response.message, 'success')
            return []
        } catch (error) {
            return rejectWithValue('Failed to update cart')
        }
    }
)
