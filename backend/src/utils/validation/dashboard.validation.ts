import { query, ValidationChain } from 'express-validator';

export const dashboardGraphRequestBodyValidator: ValidationChain[] = [
    query('year')
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1000, max: 9999 })
        .withMessage('Year must be a valid four-digit number between 1000 and 9999')
        .toInt(),
];
