import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/user.slice"

const rootRedcucer = combineReducers({
    authReducer: userSlice,
});

export default rootRedcucer;