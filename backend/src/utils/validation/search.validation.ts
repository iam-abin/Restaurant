import { query, ValidationChain } from 'express-validator';
import { paginationValidator } from './pagination.validation';

export const searchRequestQueryValidator: ValidationChain[] = [
    ...paginationValidator,
    // Validate the `searchText` in the query (optional, should be a string)
    query('searchText').optional().isString().withMessage('SearchText must be a string').trim().escape(),
];
