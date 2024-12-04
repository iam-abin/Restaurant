import { IUserRole } from '../types/roles';

export const ROLES_CONSTANTS: Readonly<IUserRole> = Object.freeze({
    ADMIN: 'admin',
    RESTAURANT: 'restaurant',
    USER: 'user',
});

export const JWT_KEYS_CONSTANTS = Object.freeze({
    JWT_TOKEN: 'jwtToken',
    // JWT_REFRESH_TOKEN: 'jwtRefreshToken',
});
