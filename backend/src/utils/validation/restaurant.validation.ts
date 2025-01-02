import { param, query, body } from 'express-validator';

export const restaurantUpdateValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .escape(),
    body('city')
        .notEmpty()
        .withMessage('City is required')
        .isString()
        .withMessage('City must be a string')
        .trim()
        .escape(),
    body('country')
        .notEmpty()
        .withMessage('Country is required')
        .isString()
        .withMessage('Country must be a string')
        .trim()
        .escape(),
    body('deliveryTime')
        .notEmpty()
        .withMessage('Delivery time is required')
        .isInt({ min: 1 })
        .withMessage('Delivery time must be a positive integer'),
];

export const searchRestaurantValidator = [
    // Validate the `searchText` in the URL parameter
    param('searchText')
        .notEmpty()
        .withMessage('Search text is required')
        .isString()
        .withMessage('Search text must be a string')
        .trim()
        .escape(),

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
    query('searchQuery').optional().isString().withMessage('Search query must be a string').trim().escape(),
];
