import { query } from 'express-validator';

export const paginationValidator = [
    query('page')
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(), // Converts the string to an integer
    query('limit')
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer')
        .toInt(),
];
