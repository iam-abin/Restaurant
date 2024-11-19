import { createSlice } from "@reduxjs/toolkit";
import { addAsyncThunkCases } from "../../utils/addCase";
import { logoutUser, signinUser } from "../thunk/authThunk";

interface IAuthSlice {
    authData: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IAuthSlice = {
    authData: null,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: "auth-data",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Signin logic with custom success handling
        addAsyncThunkCases<IAuthSlice>(builder, signinUser, (state, action) => {
            state.authData = action.payload;
        });

        // Logout logic with custom success handling
        addAsyncThunkCases<IAuthSlice>(builder, logoutUser, (state) => {
            state.authData = null; // Clear authData on logout
        });
    },
});

// export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
