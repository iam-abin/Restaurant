import { body } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';

export const addMenuRequestBodyValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters long'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description must not exceed 200 characters'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('cuisine')
        .notEmpty()
        .withMessage('Cuisine is required')
        .trim()
        .isString()
        .withMessage('Cuisine must be a string'),
];

export const updateMenuRequestBodyValidator = [
    body('name').isString().withMessage('Name must be a string').optional(),
    body('description').isString().withMessage('Description must be a string').optional(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number').optional(),
];
