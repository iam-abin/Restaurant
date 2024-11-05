import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors';
import { IJwtPayload, verifyJwtToken } from '../utils';
import { UserRepository } from '../database/repository';

const userRepository = new UserRepository();

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new NotAuthorizedError('UnAuthorized Request');
        const decoded: IJwtPayload = verifyJwtToken(token);
        const user = await userRepository.findUserById(decoded.userId);
        if (!user) throw new Error('User Not found');
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};
