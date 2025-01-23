import { query, ValidationChain } from 'express-validator';

const SEARCH_KEY_LENGTH: number = 100;

export const searchCuisineValidator: ValidationChain[] = [
    query('searchText')
        .isString()
        .withMessage('Search text must be a string')
        .trim()
        .isLength({ max: SEARCH_KEY_LENGTH })
        .withMessage(`SearchText must not exceed ${SEARCH_KEY_LENGTH} characters`)
        .escape(),
];
