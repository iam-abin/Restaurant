import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slice/authSlice';
import cartSlice from './slice/cartSlice';
import dashboardSlice from './slice/dashboardSlice';
import menusSlice from './slice/menusSlice';
import otpTokenSlice from './slice/otpTokenSlice';
import profileSlice from './slice/profileSlice';
import restaurantSlice from './slice/restaurantSlice';

const rootReducer = combineReducers({
    authReducer: authSlice,
    cartReducer: cartSlice,
    dashboardReducer: dashboardSlice,
    menusReducer: menusSlice,
    otpTokenReducer: otpTokenSlice,
    profileReducer: profileSlice,
    restaurantReducer: restaurantSlice,
});

export default rootReducer;
