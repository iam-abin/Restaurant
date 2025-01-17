import otpGenerator from 'otp-generator';
import { OtpConfig } from '../types';

// Configuration for OTP generation
const OTP_LENGTH: number = 6;
const OTP_CONFIG: OtpConfig = {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
};

/**
 * Generates a one-time password (OTP) based on the predefined configuration.
 * @returns {string} The generated OTP as a string.
 */
export const generateOtp = (): string => {
    return otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
};

const DEFAULT_OTP_RESEND_THRESHOLD: number = 60 * 1000; // 1 minute(in milliseconds)

/**
 * Checks whether the resend interval for OTP has been completed.
 * @param createdTime - The time when the OTP was initially created.
 * @param otpResendThreshold - Optional threshold time for resending OTP (in milliseconds).
 *                              Defaults to 1 minute if not provided.
 * @returns {boolean} Returns true if the resend interval has been completed; false otherwise.
 */
export const isOtpTOkenResendAllowed = (
    createdAt: Date,
    otpResendThreshold: number = DEFAULT_OTP_RESEND_THRESHOLD,
): boolean => {
    // Calculate the time elapsed since the OTP was created
    return new Date().getTime() - createdAt.getTime() > otpResendThreshold;
};

/**
 * Checks if an OTP is expired based on the current time and expiry time.
 *
 * @param {Date} expiresAt - The absolute time when the OTP is set to expire.
 * @returns {boolean} - Returns `true` if the OTP has expired, `false` otherwise.
 */
export const checkIsOtpTokenExpired = (expiresAt: Date): boolean => {
    return Date.now() > expiresAt.getTime();
};

/**
 * To find exact otp expiry time in seconds.
 *
 * @param {Date} expiresAt - The absolute time when the OTP or resetToken is set to expire.
 * @returns Returns the exact expiry time it seconds
 */
export const calculateExpiryTime = (expiresAt: Date): number => {
    if (!expiresAt) return 0;
    const currentTime = new Date().getTime(); // Current time in milliseconds
    const expiryTime = new Date(expiresAt).getTime(); // Expiry time in milliseconds
    return Math.max(0, Math.floor((expiryTime - currentTime) / 1000)); // Difference in seconds
};
