import { NextFunction, Request, Response } from 'express';
import { CustomError, NotAuthorizedError } from '../errors';
import { checkNodeEnvironment, winstonLogError } from '../utils';
import { NodeEnvironment, TokenType } from '../types';
import { HTTP_STATUS_CODE } from '../constants';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const isProduction: boolean = checkNodeEnvironment(NodeEnvironment.PRODUCTION);

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
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
        errors: [
            {
                message: isProduction ? 'Something went wrong!!!' : err.message || 'Internal server error',
            },
        ],
    });
};
