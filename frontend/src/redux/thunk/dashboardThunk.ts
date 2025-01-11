import { createAsyncThunk } from '@reduxjs/toolkit';
import { IAdminDashboard } from '../../types';
import { getAdminDashboardApi } from '../../api/apiMethods';

// Async thunk for fetching user profile
export const fetchAdminDashboard = createAsyncThunk<
    IAdminDashboard, // Fulfilled type
    void, // Argument type
    { rejectValue: string } // Rejected value type
>('AdminDashboard/fetchAdminDashboard', async (_, { rejectWithValue }) => {
    try {
        const response = await getAdminDashboardApi();
        return response.data as IAdminDashboard;
    } catch (error: unknown) {
        // Use rejectWithValue to handle errors
        return rejectWithValue((error as Error).message);
    }
});
