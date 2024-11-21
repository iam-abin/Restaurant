import { createAsyncThunk } from '@reduxjs/toolkit'
import { getMenusApi } from '../../api/apiMethods/menu'

// Async thunk for fetching user menus
export const fetchMenus = createAsyncThunk(
    'menus/fetchUserMenus',
    async (restaurantId: string, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            console.log('thunk ', restaurantId)

            const menus = await getMenusApi(restaurantId)
            return menus.data
        } catch (error) {
            return rejectWithValue('Failed to fetch menus')
        }
    }
)

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
