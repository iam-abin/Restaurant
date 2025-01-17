import { appConfig } from '../config/app.config';
import { getThisYear } from './date';

export const GOOGLE_TOKEN_INFO_URL: string = 'https://oauth2.googleapis.com/tokeninfo?id_token=';

export const RESET_PASSWORD_URL: string = `${appConfig.FRONTEND_URL}/reset-password`;

export const CURRENT_YEAR: number = getThisYear() || 2025

const ONE_MINUTE: number = 60; // 60 seconds
export const OTP_EXPIRY_SECONDS: number = ONE_MINUTE * 1; // 1 minute
export const OTP_EXPIRY_MILLISECONDS: number = OTP_EXPIRY_SECONDS * 1000; // Convert seconds to milliseconds
