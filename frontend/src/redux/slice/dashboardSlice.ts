import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils';
import { IAdminDashboardCard, IAdminDashboardGraph } from '../../types';
import { fetchAdminDashboardCard, fetchAdminDashboardGraph } from '../thunk/dashboardThunk';

interface IAdminDashboardSlice {
    adminDashboardCardData: IAdminDashboardCard | null;
    adminDashboardGraphData: IAdminDashboardGraph | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IAdminDashboardSlice = {
    adminDashboardCardData: null,
    adminDashboardGraphData: null,
    status: 'idle',
    error: null,
};

const adminDashboardSlice = createSlice({
    name: 'admin-dashboard-data',
    initialState,
    reducers: {
        clearAdminDashboard: (state) => {
            state.adminDashboardCardData = null;
            state.adminDashboardGraphData = null;
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchAdminDashboardCard, (state, action) => {
            state.status = 'succeeded';
            state.adminDashboardCardData = action.payload;
        });

        addAsyncThunkCases(builder, fetchAdminDashboardGraph, (state, action) => {
            state.status = 'succeeded';
            state.adminDashboardGraphData = action.payload;
        });
    },
});

export const { clearAdminDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
