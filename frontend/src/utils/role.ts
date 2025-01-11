import { Location } from 'react-router-dom';
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

/**
 * Determines if a given role is present in the specified pathname.
 * 
 * @param requiredRole - The role to check for in the pathname.
 * @param location - Current location object of the component.
 * @returns A boolean value indicating whether the `requiredRole` is included in the `pathname`.
 */
export const getRoleFromPath = (requiredRole: UserRole, location: Location): boolean => {
    return location.pathname.includes(requiredRole);
};