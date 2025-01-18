import { createAsyncThunk } from '@reduxjs/toolkit';
import { editMenuApi, getMenusApi } from '../../api/apiMethods/menu';
import { IMenu, IResponse, Menus } from '../../types';
import { hotToastMessage } from '../../utils';

// Async thunk for fetching user menus
export const fetchMenus = createAsyncThunk<
    IMenu[],
    {
        restaurantId: string;
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
    },
    { rejectValue: string | null }
>(
    'menus/fetchUserMenus',
    async ({ restaurantId, setTotalNumberOfPages, currentPage }, { rejectWithValue }) => {
        try {
            const menus = await getMenusApi(restaurantId, currentPage, 2);
            setTotalNumberOfPages((menus.data as Menus).numberOfPages);
            return (menus.data as Menus).menus;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// Async thunk for updating user menus
export const updateMenu = createAsyncThunk<
    IMenu,
    { menuId: string; updateData: Partial<IMenu> },
    { rejectValue: string | null }
>('menu/updateUserMenu', async ({ menuId, updateData }, { rejectWithValue }) => {
    try {
        const updatedData: IResponse = await editMenuApi(menuId, updateData);
        hotToastMessage(updatedData.message, 'success');
        return updatedData.data as IMenu;
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});
