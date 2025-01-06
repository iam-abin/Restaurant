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
export const isOtpResendAllowed = (
    createdTime: Date,
    otpResendThreshold: number = DEFAULT_OTP_RESEND_THRESHOLD,
): boolean => {
    // Calculate the time elapsed since the OTP was created
    return new Date().getTime() - createdTime.getTime() > otpResendThreshold;
};
