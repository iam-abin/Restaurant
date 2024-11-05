import { body } from 'express-validator';

export const signinRequestBodyValidator = [
    body('email').isEmail().withMessage('Email must be valid').toLowerCase().trim().escape(),
    body('password').notEmpty().withMessage('You must supply a password').trim().escape(),
];

export const signupRequestBodyValidator = [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Email must be valid').toLowerCase().trim().escape(),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
        .escape(), // used to sanitize input by escaping characters that could be used in cross-site scripting (XSS) attacks or other injection vulnerabilities.
];