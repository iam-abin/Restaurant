import { body } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';
export const forgotPasswordRequestBodyValidator = [
    body('email').isEmail().withMessage('Email must be valid').toLowerCase().trim().escape(),
];

export const resetPasswordRequestBodyValidator = [
    ...mongoIdBodyValidator('userId'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
        .escape(), // used to sanitize input by escaping characters that could be used in cross-site scripting (XSS) attacks or other injection vulnerabilities.
];

export const verifyTokenRequestBodyValidator = [
    body('resetToken').trim().isLength({ min: 80, max: 80 }).withMessage('invalid reset token').escape(), // used to sanitize input by escaping characters that could be used in cross-site scripting (XSS) attacks or other injection vulnerabilities.
];
