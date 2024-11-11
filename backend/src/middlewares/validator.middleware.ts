import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors';

// this middleware is used to produce error if request is not valid (it's not an error handling middleware)
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req); // errors contain an object if the above validation fails in signup or signin

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
};
