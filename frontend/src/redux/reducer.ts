import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slice/authSlice';
import cartSlice from './slice/cartSlice';
import menusSlice from './slice/menusSlice';
import otpTokenSlice from './slice/otpTokenSlice';
import profileSlice from './slice/profileSlice';
import restaurantSlice from './slice/restaurantSlice';
import dashboardSlice from './slice/dashboardSlice';

const rootRedcucer = combineReducers({
    authReducer: authSlice,
    profileReducer: profileSlice,
    otpTokenReducer: otpTokenSlice,
    restaurantReducer: restaurantSlice,
    menusReducer: menusSlice,
    cartReducer: cartSlice,
    dashboardReducer: dashboardSlice,
});

export default rootRedcucer;
