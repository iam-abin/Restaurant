import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors';

/**
 * This middleware is used to produce error if request is not valid (it's not an error handling middleware)
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const errors: Result<ValidationError> = validationResult(req); // errors contain an object if the above validation fails

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
};
