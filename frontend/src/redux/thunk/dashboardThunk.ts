import { createAsyncThunk } from '@reduxjs/toolkit';
import { IAdminDashboardCard, IAdminDashboardGraph, Year } from '../../types';
import { getAdminDashboardCardApi, getAdminDashboardGraphApi } from '../../api/apiMethods';

export const fetchAdminDashboardCard = createAsyncThunk<IAdminDashboardCard, void, { rejectValue: string }>(
    'AdminDashboard/fetchAdminDashboardCard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAdminDashboardCardApi();
            return response.data as IAdminDashboardCard;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const fetchAdminDashboardGraph = createAsyncThunk<IAdminDashboardGraph, Year, { rejectValue: string }>(
    'AdminDashboard/fetchAdminDashboardGraph',
    async ({ year }, { rejectWithValue }) => {
        try {
            const response = await getAdminDashboardGraphApi(year);
            return response.data as IAdminDashboardGraph;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);
