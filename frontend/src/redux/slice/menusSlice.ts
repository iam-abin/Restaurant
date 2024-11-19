import { createSlice } from '@reduxjs/toolkit'
import { addAsyncThunkCases } from '../../utils/addCase'
import { fetchMenus } from '../thunk/menusThunk'

interface IMenusSlice {
    menusData: any | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialState: IMenusSlice = {
    menusData: null,
    status: 'idle',
    error: null
}

const menusSlice = createSlice({
    name: 'menus-data',
    initialState,
    reducers: {
        clearMenus: (state) => {
            state.menusData = null
        }
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchMenus, (state, action) => {
            state.status = 'succeeded'
            state.menusData = action.payload
        })
    }
})

export const { clearMenus } = menusSlice.actions;
export default menusSlice.reducer
