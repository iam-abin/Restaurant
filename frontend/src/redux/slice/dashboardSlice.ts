import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils';
import { IAdminDashboard } from '../../types';
import { fetchAdminDashboard } from '../thunk/dashboardThunk';

interface IAdminDashboardSlice {
    adminDashboardData: IAdminDashboard | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IAdminDashboardSlice = {
    adminDashboardData: null,
    status: 'idle',
    error: null,
};

const adminDashboardSlice = createSlice({
    name: 'admin-dashboard-data',
    initialState,
    reducers: {
        clearAdminDashboard: (state) => {
            state.adminDashboardData = null;
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchAdminDashboard, (state, action) => {
            state.status = 'succeeded';
            state.adminDashboardData = action.payload;
        });
    },
});

export const { clearAdminDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
