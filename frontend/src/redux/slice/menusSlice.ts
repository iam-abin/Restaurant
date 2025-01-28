import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils';
import { fetchMenus, updateMenu } from '../thunk/menusThunk';
import { IMenu } from '../../types';

interface IMenusSlice {
    menusData: IMenu[] | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IMenusSlice = {
    menusData: null,
    status: 'idle',
    error: null,
};

const menusSlice = createSlice({
    name: 'menus-data',
    initialState,
    reducers: {
        clearMenus: (state) => {
            state.menusData = null;
        },
        updateMenuItemCloseStatus: (state, action) => {
            const { menuItemId, isClosed } = action.payload;

            if (state.menusData) {
                state.menusData = state.menusData.map((menu: IMenu) => {
                    if (menu._id === menuItemId) {
                        return {
                            ...menu,
                            isClosed,
                        };
                    }
                    return menu;
                });
            }
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchMenus, (state, action) => {
            state.status = 'succeeded';
            state.menusData = action.payload;
        });

        addAsyncThunkCases(builder, updateMenu, (state, action) => {
            state.status = 'succeeded';
            // Safely update the `menusData` only if it's not null
            if (state.menusData) {
                state.menusData = state.menusData.map((menuItem: IMenu) => {
                    if (menuItem._id === action.payload._id) return action.payload;
                    return menuItem;
                });
            }
        });
    },
});

export const { clearMenus, updateMenuItemCloseStatus } = menusSlice.actions;
export default menusSlice.reducer;
