import { body, ValidationChain } from 'express-validator';

export const updateProfileRequestBodyValidator: ValidationChain[] = [
    body('image').optional().isString().withMessage('Image must be a string').trim(),
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .escape(),
    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .isString()
        .withMessage('Address must be a string')
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
];
