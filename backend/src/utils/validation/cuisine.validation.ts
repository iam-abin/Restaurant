import { param } from 'express-validator';


export const searchCuisineValidator = [
    param('searchText')
        .isString()
        .withMessage('Search text must be a string')
        .trim()
        .escape(),
];
