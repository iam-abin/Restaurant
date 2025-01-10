import { UserRole } from '../types';

/**
 * Checks if the provided user role matches the required role.
 * @param requiredRole - The role that needs to be true for access.
 * @param userRole - The role of the available user.
 * @returns A boolean value indicating whether the user has the required role.
 */
export const checkRole = (requiredRole: UserRole, userRole?: UserRole): boolean => {
    if (!userRole) return false;
    return userRole === requiredRole;
};
