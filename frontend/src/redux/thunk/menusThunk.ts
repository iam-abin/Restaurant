import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMenusApi } from '../../api/apiMethods/menu';
import { IMenu, Menus } from '../../types';

// Async thunk for fetching user menus
export const fetchMenus = createAsyncThunk<IMenu[], { restaurantId: string, setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>> }, { rejectValue: string | null }>(
    'menus/fetchUserMenus',
    async ({ restaurantId , setTotalNumberOfPages}, { rejectWithValue }) => {
        try {
            console.log('thunk ', restaurantId);
            const menus = await getMenusApi(restaurantId);
            setTotalNumberOfPages((menus.data as Menus).numberOfPages)
            return (menus.data as Menus).menus;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

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
