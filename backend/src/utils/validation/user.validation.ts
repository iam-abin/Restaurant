import { body, ValidationChain } from 'express-validator';
import { UserRole } from '../../types';

const ROLES: string[] = [UserRole.ADMIN, UserRole.RESTAURANT, UserRole.USER];

export const signinRequestBodyValidator: ValidationChain[] = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid')
        .toLowerCase()
        .trim()
        .escape(),
    body('password').notEmpty().withMessage('You must supply a password').trim().escape(),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(ROLES)
        .withMessage(`Role must be one of ${ROLES.join(', ')}`)
        .trim()
        .escape(),
];

export const signupRequestBodyValidator: ValidationChain[] = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .escape(),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid')
        .toLowerCase()
        .trim()
        .escape(),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(ROLES)
        .withMessage(`Role must be one of ${ROLES.join(', ')}`)
        .trim()
        .escape(),
    body('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isNumeric()
        .withMessage('Phone number must be numeric')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be exactly 10 digits')
        .trim(),
    body('password')
        .notEmpty()
        .withMessage('Password number is required')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
        .escape(), // used to sanitize input by escaping characters that could be used in cross-site scripting (XSS) attacks or other injection vulnerabilities.
];

export const googleAuthRequestBodyValidator = [
    body('credential')
        .notEmpty()
        .withMessage('credential is required')
        .isString()
        .withMessage('credential must be a string')
        .trim()
        .escape(),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(ROLES)
        .withMessage(`Role must be one of ${ROLES.join(', ')}`)
        .trim()
        .escape(),
];
