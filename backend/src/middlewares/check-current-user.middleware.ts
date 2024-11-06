import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors';
import { IJwtPayload, verifyJwtToken } from '../utils';

// Extend Express's Request interface globally
declare global {
    namespace Express {
        interface Request {
            currentUser: IJwtPayload;
        }
    }
}

// Middleware to get current user from token and assign it to req.currentUser
export const checkCurrentUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.jwtToken;
        if (!accessToken) return next();

        const payload = verifyJwtToken(accessToken);
        req.currentUser = payload;

        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Pass the error message string to NotAuthorizedError
            next(new NotAuthorizedError(error.message));
        } else {
            next(new NotAuthorizedError('Authorization error'));
        }
    }
};
