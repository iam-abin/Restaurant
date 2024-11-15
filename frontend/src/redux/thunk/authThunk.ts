import { createAsyncThunk } from "@reduxjs/toolkit";
import { signinApi, logoutApi } from "../../api/apiMethods/auth";


// Async thunk for user sign-in
export const signinUser = createAsyncThunk(
    "auth/userSignin",
    async (data: any, { rejectWithValue }) => {
        try {
            return await signinApi(data);
        } catch (error) {
            return rejectWithValue("Failed to sign in");
        }
    }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
    "auth/userLogout",
    async (_, { rejectWithValue }) => { // Use an underscore to indicate no payload
        try {
            return await logoutApi();
        } catch (error) {
            return rejectWithValue("Failed to log out");
        }
    }
);

