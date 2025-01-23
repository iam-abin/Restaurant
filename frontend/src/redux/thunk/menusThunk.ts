import { createAsyncThunk } from '@reduxjs/toolkit';
import { editMenuApi, getMenusApi } from '../../api/apiMethods/menu';
import { IMenu, IResponse, Menus } from '../../types';
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
            const menus = await getMenusApi(restaurantId, currentPage, limit);
            setTotalNumberOfPages((menus.data as Menus).numberOfPages);
            return (menus.data as Menus).menus;
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
        const updatedData: IResponse = await editMenuApi(menuId, updateData);
        hotToastMessage(updatedData.message, 'success');
        return updatedData.data as IMenu;
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});
