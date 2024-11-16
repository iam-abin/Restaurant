import { createAsyncThunk } from "@reduxjs/toolkit";
import { signinApi, logoutApi } from "../../api/apiMethods/auth";
import { ISignin } from "../../types";
import { hotToastMessage } from "../../utils/hotToast";
import { IResponse } from "../../types/api";

// Async thunk for user sign-in
export const signinUser = createAsyncThunk(
    "auth/userSignin",
    async (data: ISignin, { rejectWithValue }) => {
        try {
            console.log("data ",data);
            const result: IResponse = await signinApi(data);
            hotToastMessage(result.message, "success")   
            return result
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
            const result: IResponse = await logoutApi();
            hotToastMessage(result.message, "success")   
            return result
        } catch (error) {
            
            return rejectWithValue("Failed to log out");
        }
    }
);

