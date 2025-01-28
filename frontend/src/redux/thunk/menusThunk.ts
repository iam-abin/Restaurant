import { createAsyncThunk } from '@reduxjs/toolkit';
import { editMenuItemApi, getMenuApi } from '../../api/apiMethods/menu';
import { IMenu, IResponse, Menu } from '../../types';
import { hotToastMessage } from '../../utils';

export const fetchMenus = createAsyncThunk<
    IMenu[],
    {
        restaurantId: string;
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
        limit?: number;
    },
    { rejectValue: string | null }
>(
    'menus/fetchUserMenus',
    async ({ restaurantId, setTotalNumberOfPages, currentPage, limit }, { rejectWithValue }) => {
        try {
            const menus = await getMenuApi(restaurantId, currentPage, limit);
            setTotalNumberOfPages((menus.data as Menu).numberOfPages);
            return (menus.data as Menu).menu;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const updateMenu = createAsyncThunk<
    IMenu,
    { menuId: string; updateData: Partial<IMenu> },
    { rejectValue: string | null }
>('menu/updateUserMenu', async ({ menuId, updateData }, { rejectWithValue }) => {
    try {
        const updatedData: IResponse = await editMenuItemApi(menuId, updateData);
        hotToastMessage(updatedData.message, 'success');
        return updatedData.data as IMenu;
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});
