import { createSlice } from '@reduxjs/toolkit';
import { fetchProfiles, fetchUserProfile, searchProfiles, updateUserProfile } from '../thunk/profileThunk';
import { addAsyncThunkCases } from '../../utils';
import { IProfile, IUser } from '../../types';

interface IProfileSlice {
    myProfile: IProfile | null;
    userProfileListData: IProfile[] | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IProfileSlice = {
    myProfile: null,
    userProfileListData: [],
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: 'profile-data',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.myProfile = null;
        },
        clearUserProfileList: (state) => {
            state.userProfileListData = [];
        },

        updateUserProfileBlockStatus: (state, action) => {
            const { userId, isBlocked } = action.payload;
            if (state.userProfileListData) {
                state.userProfileListData = state.userProfileListData.map((profile) => {
                    if ((profile.userId as IUser)._id === userId) {
                        return {
                            ...profile,
                            userId: {
                                ...(profile.userId as IUser),
                                isBlocked,
                            },
                        };
                    }
                    return profile;
                });
            }
        },
    },
    extraReducers: (builder) => {
        addAsyncThunkCases(builder, fetchUserProfile, (state, action) => {
            state.status = 'succeeded';
            state.myProfile = action.payload;
        });
        addAsyncThunkCases(builder, updateUserProfile, (state, action) => {
            state.status = 'succeeded';
            state.myProfile = action.payload;
        });
        addAsyncThunkCases(builder, fetchProfiles, (state, action) => {
            state.status = 'succeeded';
            state.userProfileListData = action.payload;
        });

        addAsyncThunkCases(builder, searchProfiles, (state, action) => {
            state.status = 'succeeded';
            state.userProfileListData = action.payload;
        });
    },
});

export const { clearProfile, clearUserProfileList, updateUserProfileBlockStatus } = profileSlice.actions;
export default profileSlice.reducer;
