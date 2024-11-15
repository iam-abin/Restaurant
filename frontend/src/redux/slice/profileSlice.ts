import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchUserProfile, updateUserProfile } from "../thunk/profileThunk";
import { addAsyncThunkCases } from "../../utils/addCase";

interface IProfileSlice {
    myProfile: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IProfileSlice = {
    myProfile: null,
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: "profile-data",
    initialState,
    reducers: {
        setMyProfileData: (state, action: PayloadAction<any>) => {
            state.myProfile = action.payload;
        },
        clearMyProfileData: (state) => {
            state.myProfile = null;
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchUserProfile, (state, action) => {
            state.status = "succeeded";
            state.myProfile = action.payload;
        });
        addAsyncThunkCases(builder, updateUserProfile, (state, action) => {
            state.status = "succeeded";
            state.myProfile = action.payload;
        });
    },
});

export const { setMyProfileData, clearMyProfileData } = profileSlice.actions;
export default profileSlice.reducer;
