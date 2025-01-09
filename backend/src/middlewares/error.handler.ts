import { NextFunction, Request, Response } from 'express';
import { CustomError, NotAuthorizedError } from '../errors';
import { winstonLogError } from '../utils';
import { appConfig } from '../config/app.config';
import { TokenType } from '../types';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const isProduction = appConfig.NODE_ENVIRONMENT === 'production';

    // log the error details to the error.log file
    winstonLogError(err);

    // Handle custom errors
    if (err instanceof CustomError) {
        // Clear the JWT cookie if the error is NotAuthorizedError (e.g., due to token expiration or invalid token)
        if (err instanceof NotAuthorizedError) {
            res.clearCookie(TokenType.JwtAccessToken);
        }

        // Send the serialized error response
        res.status(err.statusCode).send({ errors: err.serializeErrors() });
        return;
    }

    // For unexpected errors, send a response
    res.status(500).send({
        errors: [
            {
                message: isProduction ? 'Something went wrong!!!' : err.message || 'Internal server error',
            },
        ],
    });
};
