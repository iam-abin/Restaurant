import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slice/authSlice';
import cartSlice from './slice/cartSlice';
import menusSlice from './slice/menusSlice';
import profileSlice from './slice/profileSlice';
import restaurantSlice from './slice/restaurantSlice';

const rootRedcucer = combineReducers({
    authReducer: authSlice,
    profileReducer: profileSlice,
    restaurantReducer: restaurantSlice,
    menusReducer: menusSlice,
    cartReducer: cartSlice
});

export default rootRedcucer;
