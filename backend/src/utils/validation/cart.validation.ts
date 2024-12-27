import { body, param } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';

export const addToCartRequestBodyValidator = [...mongoIdBodyValidator(['itemId', 'restaurantId'])];

export const updateCartRequestBodyValidator = [
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .isInt({ min: 1, max: 10 })
        .withMessage('Quantity must be  between 1 and 10'),
];
