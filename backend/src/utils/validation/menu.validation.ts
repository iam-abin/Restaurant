import { body } from 'express-validator';
import { BadRequestError } from '../../errors';

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
    body('cuisine')
        .notEmpty()
        .withMessage('Cuisine is required')
        .isString()
        .withMessage('Cuisine must be a string')
        .trim()
        .isLength({ min: 4, max: 50 })
        .withMessage('Cuisine name must be between 4 and 50 characters long'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('salePrice')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .custom((value: number, { req }) => {
            if (req.body.price && value > req.body.price) {
                throw new BadRequestError('Sale price must be less than or equal to the original price');
            }
            return true;
        }),
];

export const updateMenuRequestBodyValidator = [
    body('name')
        .optional()
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
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('salePrice').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];
