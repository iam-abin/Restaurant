import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyRestaurantApi, updateRestaurantApi } from "../../api/apiMethods/restaurant";

// Async thunk for fetching user profile
export const fetchMyRestaurant = createAsyncThunk(
    "profile/fetchUserProfile",
    async (_, { rejectWithValue }) => { // Use an underscore here as well
        try {
            const profile = await getMyRestaurantApi();
            return profile.data
        } catch (error) {
            return rejectWithValue("Failed to fetch profile");
        }
    }
);

// Async thunk for updating user profile
export const updateMyRestaurant = createAsyncThunk(
    "profile/updateUserProfile",
    async (updateData: any, { rejectWithValue }) => {
        try {
            const updatedData = await updateRestaurantApi(updateData);
            return updatedData.data
        } catch (error) {
            return rejectWithValue("Failed to update profile");
        }
    }
);
