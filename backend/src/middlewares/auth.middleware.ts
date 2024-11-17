import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError, ForbiddenError } from '../errors';

// Middleware factory that checks for different user types
export const auth = (requiredRoles: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Ensure `requiredRoles` is always treated as an array
            const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

            if (!req.currentUser) throw new ForbiddenError();

            if (!roles.includes(req.currentUser.role as string))
                throw new ForbiddenError('You have no permission to access this route');

            next();
        } catch (error) {
            next(error);
        }
    };
};
