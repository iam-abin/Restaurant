import { Meta } from 'express-validator';
import { BadRequestError } from '../../errors';

/**
 * Custom validator to ensure only allowed fields are present in the request body.
 * @param allowedFields - Array of strings representing allowed field names.
 */
export const validateAllowedFields = (allowedFields: string[]) => {
    return (_: unknown, meta: Meta) => {
        const { req } = meta; // Extract the req object from the Meta type
        Object.keys(req.body).forEach((key) => {
            if (!allowedFields.includes(key)) {
                throw new BadRequestError(`Unexpected field: ${key}`);
            }
        });
        return true;
    };
};
