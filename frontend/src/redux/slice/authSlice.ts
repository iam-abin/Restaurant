import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils/addCase';
import { signinUser, logoutUser, googleAuthThunk } from '../thunk/authThunk';
import { IUser } from '../../types';

interface IAuthSlice {
    authData: IUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IAuthSlice = {
    authData: null,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth-data',
    initialState,
    reducers: {
        // resetAuth: (state) => {
        //     state.authData = null;
        //     state.status = 'idle';
        //     state.error = null;
        // },
    },
    extraReducers: (builder) => {
        // Signin logic
        addAsyncThunkCases(builder, signinUser, (state, action) => {
            state.authData = action.payload;
        });

        addAsyncThunkCases(builder, googleAuthThunk, (state, action) => {
            state.authData = action.payload;
        });

        // Logout logic
        addAsyncThunkCases(builder, logoutUser, (state) => {
            state.authData = null;
            state.error = null;
            state.status = 'idle';
        });
    },
});

// export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
