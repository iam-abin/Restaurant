import { createSlice } from '@reduxjs/toolkit';
import { addAsyncThunkCases } from '../../utils/addCase';
import { signinUser, logoutUser } from '../thunk/authThunk';

interface IAuthSlice {
    authData: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IAuthSlice = {
    authData: null,
    status: 'idle',
    error: null
};

const authSlice = createSlice({
    name: 'auth-data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Signin logic
        addAsyncThunkCases<IAuthSlice>(builder, signinUser, (state, action) => {
            state.authData = action.payload;
        });

        // Logout logic
        addAsyncThunkCases<IAuthSlice>(builder, logoutUser, (state) => {
            state.authData = null;
            state.error = null;
            state.status = 'idle';
        });
    }
});

export default authSlice.reducer;