import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getProfileApi,
    getProfilesApi,
    searchProfileApi,
    updateProfileApi,
} from '../../api/apiMethods/profile';
import { hotToastMessage } from '../../utils';
import { IProfile, IProfilesResponse, IResponse, ProfileUpdate } from '../../types';

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

export const updateUserProfile = createAsyncThunk<
    IProfile,
    Partial<IProfile>,
    { rejectValue: string | null }
>('profile/updateUserProfile', async (updateData: Partial<ProfileUpdate>, { rejectWithValue }) => {
    try {
        const updatedData = await updateProfileApi(updateData);
        hotToastMessage(updatedData.message, 'success');
        return updatedData.data as IProfile;
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});

export const fetchProfiles = createAsyncThunk<
    IProfile[],
    {
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
        limit?: number;
    },
    { rejectValue: string | null }
>('menus/fetchProfiles', async ({ setTotalNumberOfPages, currentPage, limit }, { rejectWithValue }) => {
    try {
        const profilesData: IResponse | [] = await getProfilesApi(currentPage, limit);
        const data = profilesData?.data as IProfilesResponse;
        setTotalNumberOfPages(data.numberOfPages);
        return data.profiles as IProfile[];
    } catch (error: unknown) {
        return rejectWithValue((error as Error).message);
    }
});

export const searchProfiles = createAsyncThunk<
    IProfile[],
    {
        searchKey: string;
        setTotalNumberOfPages: React.Dispatch<React.SetStateAction<number>>;
        currentPage: number;
        limit?: number;
    },
    { rejectValue: string | null }
>(
    'menus/searchProfiles',
    async ({ searchKey, setTotalNumberOfPages, currentPage, limit }, { rejectWithValue }) => {
        try {
            const profilesData: IResponse | [] = await searchProfileApi(searchKey, currentPage, limit);

            const data = profilesData?.data as IProfilesResponse;
            setTotalNumberOfPages(data.numberOfPages);
            return data.profiles as IProfile[];
        } catch (error: unknown) {
            return rejectWithValue((error as Error).message);
        }
    },
);
