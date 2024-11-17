import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ForbiddenError, NotAuthorizedError, NotFoundError } from '../errors';
import { IJwtPayload, verifyJwtToken } from '../utils';
import { UserRepository } from '../database/repository';

// Extend Express's Request interface globally
declare global {
    namespace Express {
        interface Request {
            currentUser: IJwtPayload;
        }
    }
}

const userRepository = new UserRepository();

// Middleware to get current user from token and assign it to req.currentUser
export const checkCurrentUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.jwtToken;
        if (!accessToken) return next();

        const payload = verifyJwtToken(accessToken);
        const user = await userRepository.findUserById(payload.userId);
        if (!user) throw new NotFoundError('User Not found');
        if (!user.isVerified) throw new ForbiddenError('Your are not verified');
        if (user.isBlocked) throw new ForbiddenError('You are a blocked user');
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
