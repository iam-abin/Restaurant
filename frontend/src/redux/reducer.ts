import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice"
import profileSlice from "./slice/profileSlice"

const rootRedcucer = combineReducers({
    authReducer: authSlice,
    profileReducer: profileSlice,
    
});

export default rootRedcucer;