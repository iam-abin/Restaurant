import { container } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, NotAuthorizedError, NotFoundError } from '../errors';
import { verifyJwtAccessToken } from '../utils';
import { UserRepository } from '../database/repository';
import { IJwtPayload } from '../types';
import { IUserDocument } from '../database/model';

// Extend Express's Request interface globally
declare global {
    namespace Express {
        interface Request {
            currentUser: IJwtPayload;
        }
    }
}

const userRepository = container.resolve(UserRepository);

// Middleware to get current user from token and assign it to req.currentUser
export const checkCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtAccessToken: string = req.cookies?.jwtAccessToken;
        if (!jwtAccessToken) return next();

        const payload: IJwtPayload = verifyJwtAccessToken(jwtAccessToken);
        const user: IUserDocument | null = await userRepository.findUserById(payload.userId);
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
