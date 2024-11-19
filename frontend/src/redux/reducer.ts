import { combineReducers } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import menusSlice from './slice/menusSlice'
import profileSlice from './slice/profileSlice'
import restaurantSlice from './slice/restaurantSlice'

const rootRedcucer = combineReducers({
    authReducer: authSlice,
    profileReducer: profileSlice,
    restaurantReducer: restaurantSlice,
    menusReducer: menusSlice
})

export default rootRedcucer
