import { body, param } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';

export const addToCartRequestBodyValidator = [
    ...mongoIdBodyValidator('itemId'),
    ...mongoIdBodyValidator('restaurantId'),
];

export const updateCartRequestBodyValidator = [
    body('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1, max: 10 })
        .withMessage('Quantity must be  between 1 and 10'),
];
