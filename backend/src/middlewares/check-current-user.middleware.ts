import { container } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, NotAuthorizedError, NotFoundError } from '../errors';
import { verifyJwtAccessToken } from '../utils';
import { UserRepository } from '../database/repositories';
import { IJwtPayload } from '../types';
import { IUserDocument } from '../database/models';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

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
        // Handle specific JWT errors
        if (error instanceof TokenExpiredError) throw new NotAuthorizedError('Token has expired');
        if (error instanceof JsonWebTokenError) throw new NotAuthorizedError('Invalid token');

        next(error);
    }
};
