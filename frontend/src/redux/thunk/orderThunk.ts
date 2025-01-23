import { createAsyncThunk } from '@reduxjs/toolkit';

import { IResponse, IRestaurantOrder, Orders } from '../../types';
import { getRestaurantOrdersApi } from '../../api/apiMethods';

export const fetchRestaurantOrders = createAsyncThunk<
    IRestaurantOrder[],
    {
        restaurantId: string;
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
        limit?: number;
    },
    { rejectValue: string | null }
>(
    'menus/fetchRestaurantOrders',
    async ({ restaurantId, setTotalNumberOfPages, currentPage, limit }, { rejectWithValue }) => {
        try {
            const orders: IResponse = await getRestaurantOrdersApi(restaurantId, currentPage, limit);
            const data = orders.data as Orders;

            setTotalNumberOfPages(data.numberOfPages);
            return data.orders;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);
