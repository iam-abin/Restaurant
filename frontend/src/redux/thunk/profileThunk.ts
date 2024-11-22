import { createAsyncThunk } from '@reduxjs/toolkit'
import { getProfileApi, updateProfileApi } from '../../api/apiMethods/profile'
import { hotToastMessage } from '../../utils/hotToast'

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        // Use an underscore here as well
        try {
            console.log('inside thunk ')

            const profile = await getProfileApi()
            return profile.data
        } catch (error) {
            return rejectWithValue('Failed to fetch profile')
        }
    }
)

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (updateData: any, { rejectWithValue }) => {
        try {
            const updatedData = await updateProfileApi(updateData)
            hotToastMessage(updatedData.message, 'success')
            return updatedData.data
        } catch (error) {
            return rejectWithValue('Failed to update profile')
        }
    }
)
