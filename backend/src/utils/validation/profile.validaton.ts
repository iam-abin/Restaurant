import { body } from 'express-validator';

export const updateProfileRequestBodyValidator = [
    body('image').optional().isString().withMessage('Image must be a string'),
    body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    body('address')
        .isString()
        .withMessage('Address must be a string')
        .notEmpty()
        .withMessage('Address is required'),
    body('city').isString().withMessage('City must be a string').notEmpty().withMessage('City is required'),
    body('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Country is required'),
];
