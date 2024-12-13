import { query } from 'express-validator';


export const searchCuisineValidator = [
    query('searchText')
        .isString()
        .withMessage('Search text must be a string')
        .trim()
        .escape(),
];
