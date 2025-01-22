import { query, ValidationChain } from 'express-validator';
import { paginationValidator } from './pagination.validation';
import { SEARCH_KEY_LENGTH } from '../../constants';

export const searchRequestQueryValidator: ValidationChain[] = [
    ...paginationValidator,
    query('searchText')
        .optional()
        .isString()
        .withMessage('SearchText must be a string')
        .trim()
        .isLength({ max: SEARCH_KEY_LENGTH })
        .withMessage(`SearchText must not exceed ${SEARCH_KEY_LENGTH} characters`)
        .escape(),
];
