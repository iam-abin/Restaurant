import { query, ValidationChain } from 'express-validator';

const minimumValue: number = 1;

export const paginationValidator: ValidationChain[] = [
    query('page')
        .optional()
        .trim()
        .escape()
        .isInt({ min: minimumValue })
        .withMessage('Page must be a positive integer')
        .toInt(), // Converts the string to an integer
    query('limit')
        .optional()
        .trim()
        .escape()
        .isInt({ min: minimumValue })
        .withMessage('Limit must be a positive integer')
        .toInt(),
];
