import { body } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';

export const addMenuRequestBodyValidator = [
    body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    body('description').isString().withMessage('Description must be a string').optional(),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .notEmpty()
        .withMessage('Price is required'),
    ...mongoIdBodyValidator('restaurantId'),
];

export const updateMenuRequestBodyValidator = [
    // ...mongoIdBodyValidator('itemId'),
    body('name').isString().withMessage('Name must be a string').optional(),
    body('description').isString().withMessage('Description must be a string').optional(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number').optional(),
];
