import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMenusApi } from '../../api/apiMethods/menu';
import { IMenu } from '../../types';

// Async thunk for fetching user menus
export const fetchMenus = createAsyncThunk<
    IMenu,
    { restaurantId: string },
    { rejectValue: string | null }
>('menus/fetchUserMenus', async ({ restaurantId }, { rejectWithValue }) => {
    try {
        console.log('thunk ', restaurantId);
        const menus = await getMenusApi(restaurantId);
        return menus.data as IMenu;
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});

// // Async thunk for updating user menus
// export const updateMenu = createAsyncThunk(
//     'menu/updateUserMenu',
//     async (updateData: any, { rejectWithValue }) => {
//         try {
//             // const updatedData = await updateMenu(updateData)
//             // return updatedData.data
//         } catch (error) {
//             return rejectWithValue('Failed to update menu')
//         }
//     }
// )
