import { appConfig } from '../config/app.config';
import { IUserRole } from '../types/roles';

export const ROLES_CONSTANTS: Readonly<IUserRole> = Object.freeze({
    ADMIN: 'admin',
    RESTAURANT: 'restaurant',
    USER: 'user',
});

export const JWT_KEYS_CONSTANTS = Object.freeze({
    JWT_TOKEN: 'jwtToken',
    JWT_REFRESH_TOKEN: 'jwtRefreshToken',
});

export const GOOGLE_TOKEN_INFO_URL: string = 'https://oauth2.googleapis.com/tokeninfo?id_token=';

export const RESET_PASSWORD_URL = `${appConfig.FRONTEND_URL}/reset-password`;
