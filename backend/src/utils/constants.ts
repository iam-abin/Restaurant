import { IUserRole } from '../types/roles';

export const ROLES: Readonly<IUserRole> = Object.freeze({
    ADMIN: 'admin',
    RESTAURANT: 'restaurant',
    USER: 'user',
});

export const JWT_KEYS = Object.freeze({
    JWT_TOKEN: 'jwtToken',
    JWT_REFRESH_TOKEN: 'jwtRefreshToken',
});
