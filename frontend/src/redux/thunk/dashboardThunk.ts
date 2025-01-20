import { createAsyncThunk } from '@reduxjs/toolkit';
import { IAdminDashboardCard, IAdminDashboardGraph, Year } from '../../types';
import { getAdminDashboardCardApi, getAdminDashboardGraphApi } from '../../api/apiMethods';

export const fetchAdminDashboardCard = createAsyncThunk<
    IAdminDashboardCard, // Fulfilled type
    void, // Argument type
    { rejectValue: string } // Rejected value type
>('AdminDashboard/fetchAdminDashboardCard', async (_, { rejectWithValue }) => {
    try {
        const response = await getAdminDashboardCardApi();
        return response.data as IAdminDashboardCard;
    } catch (error: unknown) {
        // Use rejectWithValue to handle errors
        return rejectWithValue((error as Error).message);
    }
});

export const fetchAdminDashboardGraph = createAsyncThunk<
    IAdminDashboardGraph, // Fulfilled type
    Year, // Argument type
    { rejectValue: string } // Rejected value type
>('AdminDashboard/fetchAdminDashboardGraph', async ({ year }, { rejectWithValue }) => {
    try {
        const response = await getAdminDashboardGraphApi(year);
        return response.data as IAdminDashboardGraph;
    } catch (error: unknown) {
        // Use rejectWithValue to handle errors
        return rejectWithValue((error as Error).message);
    }
});
