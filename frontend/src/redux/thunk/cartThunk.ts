import { createAsyncThunk } from '@reduxjs/toolkit'
import { addToCartApi, getCartItemsApi, removeCartItemApi, removeCartItemsApi } from '../../api/apiMethods/cart'
import { hotToastMessage } from '../../utils/hotToast'

// Async thunk for fetching user cart
export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            const cart = await getCartItemsApi()
            return cart.data
        } catch (error) {
            return rejectWithValue('Failed to fetch cart')
        }
    }
)

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (itemId: string, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            const cart = await addToCartApi(itemId)
            hotToastMessage(cart.message, 'success')
            return cart.data
        } catch (error) {
            return rejectWithValue('Failed to fetch cart')
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
            hotToastMessage(response.message,'success')
            return []
        } catch (error) {
            return rejectWithValue('Failed to update cart')
        }
    }
)
