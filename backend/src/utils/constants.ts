import { appConfig } from '../config/app.config';

export const JWT_KEYS_CONSTANTS = Object.freeze({
    JWT_ACCESS_TOKEN: 'jwtToken',
    JWT_REFRESH_TOKEN: 'jwtRefreshToken',
});

export const GOOGLE_TOKEN_INFO_URL: string = 'https://oauth2.googleapis.com/tokeninfo?id_token=';

export const RESET_PASSWORD_URL = `${appConfig.FRONTEND_URL}/reset-password`;
