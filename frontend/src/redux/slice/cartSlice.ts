import { createSlice } from '@reduxjs/toolkit'
import { addAsyncThunkCases } from '../../utils/addCase'
import { addToCart, fetchCartItems, removeCartItem, removeCartItems } from '../thunk/cartThunk'

interface ICartSlice {
    cartData: any | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialState: ICartSlice = {
    cartData: [],
    status: 'idle',
    error: null
}

const cartSlice = createSlice({
    name: 'cart-data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchCartItems, (state, action) => {
            state.status = 'succeeded'
            state.cartData = action.payload
        })
        addAsyncThunkCases(builder, addToCart, (state, action) => {
            // Remove the item with the given ID from cartData
            state.status = 'succeeded'
            state.cartData = [...state.cartData, action.payload]
        })
        addAsyncThunkCases(builder, removeCartItem, (state, action) => {
            // Remove the item with the given ID from cartData
            state.status = 'succeeded'
            state.cartData = state.cartData.filter((item: any) => item.id !== action.payload)
        })

        addAsyncThunkCases(builder, removeCartItems, (state) => {
            // Remove the item with the given ID from cartData
            state.status = 'succeeded'
            state.cartData = []
        })
    }
})

export default cartSlice.reducer
