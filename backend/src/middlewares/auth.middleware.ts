import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, NotAuthorizedError } from '../errors';

// Middleware factory that checks for different user types
export const auth = (requiredRoles: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (!req.currentUser) throw new NotAuthorizedError('Cannot access protected route');

            // Ensure `requiredRoles` is always treated as an array
            const roles: string[] = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

            if (!roles.includes(req.currentUser.role as string))
                throw new ForbiddenError('You have no permission to access this route');

            next();
        } catch (error: unknown) {
            next(error as Error);
        }
    };
};
