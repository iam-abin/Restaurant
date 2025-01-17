/**
 * Calculate remaining time for otp resend in seconds
 *
 * @param otpTokenExpiry time at which otp will expires
 * @returns remaining time in seconds
 */
export const calculateRemainingTime = (otpTokenExpiry: Date): number => {
    if (!otpTokenExpiry) return 0;
    const expiryTime: number = new Date(otpTokenExpiry).getTime();
    const currentTime: number = new Date().getTime();
    const remainingTime: number = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
    return remainingTime;
};
