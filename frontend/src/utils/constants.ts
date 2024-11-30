import { IUserRole } from '../types';

// export const PRODUCTION_ORIGIN = "https://abinvarghese.online"
export const DEVELOPMENT_ORIGIN = 'http://localhost:3000';

export const BASE_URL_BACKEND: string = `${DEVELOPMENT_ORIGIN}/api/v1`;

export const ROLES_CONSTANTS: Readonly<IUserRole> = Object.freeze({
    ADMIN: 'admin',
    RESTAURANT: 'restaurant',
    USER: 'user',
});
