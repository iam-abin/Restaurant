import { combineReducers } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import profileSlice from './slice/profileSlice'
import restaurantSlice from './slice/restaurantSlice'

const rootRedcucer = combineReducers({
    authReducer: authSlice,
    profileReducer: profileSlice,
    restaurantReducer: restaurantSlice
})

export default rootRedcucer
