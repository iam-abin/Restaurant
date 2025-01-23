import { createAsyncThunk } from '@reduxjs/toolkit';
import { signinApi, logoutApi, googleAuthApi } from '../../api/apiMethods/auth';
import { IGoogleAuth, ISignin, IUser } from '../../types';
import { hotToastMessage } from '../../utils';
import { IResponse } from '../../types/api';

// Async thunk for user sign-in
export const signinUser = createAsyncThunk<
    IUser, // Return type of the resolved value
    ISignin, // Argument type
    { rejectValue: string } // Thunk API config with rejectValue
>('auth/userSignin', async (data: ISignin, { rejectWithValue }) => {
    try {
        const result: IResponse = await signinApi(data);
        hotToastMessage(result.message, 'success');
        return result.data as IUser;
    } catch (error: unknown) {
        hotToastMessage((error as Error).message, 'error');
        // Use rejectWithValue to handle errors
        return rejectWithValue((error as Error).message);
    }
});

export const googleAuthThunk = createAsyncThunk<IUser, IGoogleAuth, { rejectValue: string }>(
    'auth/googleAuthLogin',
    async (data: IGoogleAuth, { rejectWithValue }) => {
        try {
            const result: IResponse = await googleAuthApi(data);
            hotToastMessage(result.message, 'success');
            return result.data as IUser;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/userLogout',
    async (_, { rejectWithValue }) => {
        try {
            const result: IResponse = await logoutApi();
            hotToastMessage(result.message, 'success');

            // Return void instead of null
            return;
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);
