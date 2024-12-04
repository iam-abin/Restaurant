import { createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile, updateUserProfile } from '../thunk/profileThunk';
import { addAsyncThunkCases } from '../../utils/addCase';
import { IProfile } from '../../types';

interface IProfileSlice {
    myProfile: IProfile | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IProfileSlice = {
    myProfile: null,
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: 'profile-data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchUserProfile, (state, action) => {
            state.status = 'succeeded';
            state.myProfile = action.payload;
        });
        addAsyncThunkCases(builder, updateUserProfile, (state, action) => {
            state.status = 'succeeded';
            state.myProfile = action.payload;
        });
    },
});

export default profileSlice.reducer;
