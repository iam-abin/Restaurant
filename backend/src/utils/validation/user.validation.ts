import { body } from 'express-validator';
import { ROLES_CONSTANTS } from '../constants';

const ROLES: string[] = [ROLES_CONSTANTS.ADMIN, ROLES_CONSTANTS.RESTAURANT, ROLES_CONSTANTS.USER];

export const signinRequestBodyValidator = [
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

export const signupRequestBodyValidator = [
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
    body('imageUrl')
        .notEmpty()
        .withMessage('ImageUrl is required')
        .isURL()
        .withMessage('ImageUrl is invalid')
        .trim()
        .escape(),
    body('googleId')
        .notEmpty()
        .withMessage('googleId is required')
        .isString()
        .withMessage('googleId must be a string')
        .trim()
        .escape(),
];
