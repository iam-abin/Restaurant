import { query, ValidationChain } from 'express-validator';

export const searchCuisineValidator: ValidationChain[] = [
    query('searchText').isString().withMessage('Search text must be a string').trim().escape(),
];
