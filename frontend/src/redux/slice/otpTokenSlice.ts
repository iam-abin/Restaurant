import { createSlice } from '@reduxjs/toolkit';

interface IOtpSlice {
    otpTokenExpiry: Date | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: IOtpSlice = {
    otpTokenExpiry: null,
    status: 'idle',
    error: null,
};

const otpSlice = createSlice({
    name: 'otp-data',
    initialState,
    reducers: {
        addOtpTokenTimer: (state, action) => {
            state.otpTokenExpiry = action.payload;
        },
        clearOtpTokenTimer: (state) => {
            state.otpTokenExpiry = null;
        },
    },
});

export const { addOtpTokenTimer, clearOtpTokenTimer } = otpSlice.actions;
export default otpSlice.reducer;
