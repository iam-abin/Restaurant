import { body } from 'express-validator';
import { ROLES } from '../constants';

export const signinRequestBodyValidator = [
    body('email').isEmail().withMessage('Email must be valid').toLowerCase().trim().escape(),
    body('password').notEmpty().withMessage('You must supply a password').trim().escape(),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn([ROLES.ADMIN, ROLES.RESTAURANT, ROLES.USER])
        .withMessage(`Role must be one of ${ROLES.ADMIN}, ${ROLES.RESTAURANT}, or ${ROLES.USER}`)
        .trim()
        .escape(),
];

export const signupRequestBodyValidator = [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('email').isEmail().withMessage('Email must be valid').toLowerCase().trim().escape(),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn([ROLES.ADMIN, ROLES.RESTAURANT, ROLES.USER])
        .withMessage(`Role must be one of ${ROLES.ADMIN}, ${ROLES.RESTAURANT}, or ${ROLES.USER}`)
        .trim()
        .escape(),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
        .escape(), // used to sanitize input by escaping characters that could be used in cross-site scripting (XSS) attacks or other injection vulnerabilities.
];
