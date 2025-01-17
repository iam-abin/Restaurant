import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileApi, updateProfileApi } from '../../api/apiMethods/profile';
import { hotToastMessage } from '../../utils';
import { IProfile } from '../../types';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk<IProfile, void, { rejectValue: string | null }>(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            const profile = await getProfileApi();
            return profile.data as IProfile;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk<
    IProfile, // Return type
    Partial<IProfile>, // Input type
    { rejectValue: string | null } // ThunkAPI type
>('profile/updateUserProfile', async (updateData: Partial<IProfile>, { rejectWithValue }) => {
    try {
        const updatedData = await updateProfileApi(updateData);
        hotToastMessage(updatedData.message, 'success');
        return updatedData.data as IProfile;
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});
