import otpGenerator from 'otp-generator';
import { OtpConfig } from '../types';
import { OTP_LENGTH } from '../constants';

// Configuration for OTP generation
const OTP_CONFIG: OtpConfig = {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
};

const DEFAULT_OTP_RESEND_THRESHOLD: number = 60 * 1000; // 1 minute(in milliseconds)

/**
 * Generates a one-time password (OTP) based on the predefined configuration.
 * @param {OtpConfig} otpConfig - Optional custom OTP configuration.
 * @returns {string} The generated OTP as a string.
 */
export const generateOtp = (otpConfig?: OtpConfig): string => {
    return otpGenerator.generate(OTP_LENGTH, { ...OTP_CONFIG, ...otpConfig });
};

/**
 * Checks whether the resend interval for OTP has been completed.
 * @param {Date} createdAt - The time when the OTP was initially created.
 * @param {number} otpResendThreshold - Optional threshold time for resending OTP (in milliseconds).
 *                                    Defaults to 1 minute if not provided.
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
    if (!(expiresAt instanceof Date)) {
        throw new Error('Invalid expiration time');
    }
    return Date.now() > expiresAt.getTime();
};

/**
 * Calculates the exact OTP expiry time in seconds.
 *
 * @param {Date} expiresAt - The absolute time when the OTP or resetToken is set to expire.
 * @returns {number} Returns the exact expiry time in seconds.
 */
export const calculateExpiryTime = (expiresAt: Date): number => {
    if (!(expiresAt instanceof Date)) {
        throw new Error('Invalid date type');
    }
    const currentTime = Date.now(); // Current time in milliseconds
    const expiryTime = expiresAt.getTime(); // Expiry time in milliseconds
    return Math.max(0, Math.floor((expiryTime - currentTime) / 1000)); // Difference in seconds
};
