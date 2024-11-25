import { body } from 'express-validator';

export const addMenuRequestBodyValidator = [
    body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    body('description').isString().withMessage('Description must be a string').optional(),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .notEmpty()
        .withMessage('Price is required'),
    body('restaurantId')
        .isMongoId()
        .withMessage('Restaurant ID must be a valid MongoDB Object ID')
        .notEmpty()
        .withMessage('Restaurant ID is required'),
];

export const updateMenuRequestBodyValidator = [
    body('itemId')
        .isMongoId()
        .withMessage('Item ID must be a valid MongoDB Object ID')
        .notEmpty()
        .withMessage('Item ID is required'),
    body('name').isString().withMessage('Name must be a string').optional(),
    body('description').isString().withMessage('Description must be a string').optional(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number').optional(),
];
