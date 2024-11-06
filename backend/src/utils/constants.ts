import { IUserRole } from '../types/roles';

export const ROLES: Readonly<IUserRole> = Object.freeze({
    ADMIN: 'admin',
    RESTAURANT: 'restaurant',
    USER: 'user',
});
