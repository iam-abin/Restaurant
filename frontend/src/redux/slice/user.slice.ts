import { createSlice } from "@reduxjs/toolkit";

interface IUserSlice {
    authData: any | null,
    myProfile: any | null,
    accessToken: string | null,
    refreshToken: string | null,
}


const initialState: IUserSlice = {
    authData: null,
    myProfile: null,
    accessToken: null,
    refreshToken: null,
};

const UserSlice = createSlice({
    name: "user-data",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.authData = action.payload;
        },
        clearUser: (state) => {
            state.authData = null;
        },

        setMyProfileData: (state, action) => {
			state.myProfile = action.payload;
		},

        clearMyProfileData: (state) => {
			state.myProfile = null;
		}
    },
});

export const { setUser, clearUser, setMyProfileData, clearMyProfileData } = UserSlice.actions; //we can use it in login page
export default UserSlice.reducer;