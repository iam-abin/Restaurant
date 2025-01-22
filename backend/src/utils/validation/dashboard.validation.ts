import { query, ValidationChain } from 'express-validator';

// For dashboard filtering based on year
export const MINIMUM_YEAR_VALUE: number = 1000;
export const MAXIMUM_YEAR_VALUE: number = 9999;

export const dashboardGraphRequestBodyValidator: ValidationChain[] = [
    query('year')
        .optional()
        .trim()
        .escape()
        .isInt({ min: MINIMUM_YEAR_VALUE, max: MAXIMUM_YEAR_VALUE })
        .withMessage('Year must be a valid four-digit number between 1000 and 9999')
        .toInt(),
];
