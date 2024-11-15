import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileApi, updateProfileApi } from "../../api/apiMethods/profile";

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    "profile/fetchUserProfile",
    async (_, { rejectWithValue }) => { // Use an underscore here as well
        try {
            return await getProfileApi();
        } catch (error) {
            return rejectWithValue("Failed to fetch profile");
        }
    }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    "profile/updateUserProfile",
    async (updateData: any, { rejectWithValue }) => {
        try {
            return await updateProfileApi(updateData);
        } catch (error) {
            return rejectWithValue("Failed to update profile");
        }
    }
);