import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError, ForbiddenError } from '../errors';
import { IUserRole } from '../types/roles';

// Middleware factory that checks for different user types
export const auth = (requiredRole: Partial<IUserRole>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.currentUser) throw new NotAuthorizedError();

            if (req.currentUser.role !== requiredRole)
                throw new ForbiddenError('You have no permission to access this route');

            next();
        } catch (error) {
            next(error);
        }
    };
};
