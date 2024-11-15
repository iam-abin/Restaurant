import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/profileSlice"

const rootRedcucer = combineReducers({
    authReducer: userSlice,
});

export default rootRedcucer;