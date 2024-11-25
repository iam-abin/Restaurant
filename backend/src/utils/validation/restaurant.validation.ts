import { param, query } from 'express-validator';

import { body } from 'express-validator';

export const restaurantUpdateValidator = [
    body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),

    body('city').isString().withMessage('City must be a string').notEmpty().withMessage('City is required'),

    body('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Country is required'),

    body('deliveryTime')
        .isInt({ min: 1 })
        .withMessage('Delivery time must be a positive integer')
        .notEmpty()
        .withMessage('Delivery time is required'),

    body('cuisines')
        .isArray({ min: 1 })
        .withMessage('Cuisines must be a non-empty array')
        .custom((cuisines: string[]) => {
            // Validate each cuisine in the array
            const areAllStrings = cuisines.every(
                (cuisine) => typeof cuisine === 'string' && cuisine.trim().length > 0,
            );
            if (!areAllStrings) {
                throw new Error('Each cuisine must be a non-empty string');
            }
            return true;
        }),
];

export const searchRestaurantValidator = [
    // Validate the `searchText` in the URL parameter
    param('searchText')
        .isString()
        .withMessage('Search text must be a string')
        .notEmpty()
        .withMessage('Search text is required'),

    // Validate the `cuisinesList` in the query (optional, should be an array if provided)
    query('cuisinesList')
        .optional()
        .isArray()
        .withMessage('Cuisines list must be an array')
        .bail()
        .custom((value) => {
            if (!value.every((item: string) => typeof item === 'string')) {
                throw new Error('Each cuisine must be a string');
            }
            return true;
        }),

    // Validate the `searchQuery` in the query (optional, should be a string)
    query('searchQuery').optional().isString().withMessage('Search query must be a string'),
];
