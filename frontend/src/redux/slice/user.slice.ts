import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IUserSlice {
    authData: any | null;
    myProfile: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IUserSlice = {
    authData: null,
    myProfile: null,
    status: 'idle',
    error: null,
};

// Async thunk for a sample API call
export const fetchUserProfile = createAsyncThunk(
    "user/fetchUserProfile",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue("Failed to fetch profile");
        }
    }
);

const userSlice = createSlice({
    name: "user-data",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.authData = action.payload;
        },
        clearUser: (state) => {
            state.authData = null;
        },
        setMyProfileData: (state, action: PayloadAction<any>) => {
            state.myProfile = action.payload;
        },
        clearMyProfileData: (state) => {
            state.myProfile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.myProfile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { setUser, clearUser, setMyProfileData, clearMyProfileData } = userSlice.actions;
export default userSlice.reducer;