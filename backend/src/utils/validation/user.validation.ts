import { body, ValidationChain } from 'express-validator';
import { UserRole } from '../../types';
import { validateAllowedFields } from './allowed-fields.validation';

const ROLES: UserRole[] = [UserRole.ADMIN, UserRole.RESTAURANT, UserRole.USER];

const signinAllowedFields: string[] = ['email', 'password', 'role'];
const signupAllowedFields: string[] = ['name', 'email', 'phone', 'password', 'role'];
const googleAuthAllowedFields: string[] = ['credential', 'role'];

const NAME_MINIMUM_LENGTH: number = 1;
const NAME_MAXIMUM_LENGTH: number = 50;
const PHONE_NUMBER_LENGTH: number = 10;
const PASSWORD_MINIMUM_LENGTH: number = 4;
const PASSWORD_MAXIMUM_LENGTH: number = 50;

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
    body('*').custom(validateAllowedFields(signinAllowedFields)),
];

export const signupRequestBodyValidator: ValidationChain[] = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: NAME_MINIMUM_LENGTH, max: NAME_MAXIMUM_LENGTH })
        .withMessage(`Name must be between ${NAME_MINIMUM_LENGTH} and ${NAME_MAXIMUM_LENGTH} characters long`)
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
    body('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isNumeric()
        .withMessage('Phone number must be numeric')
        .isLength({ min: PHONE_NUMBER_LENGTH, max: PHONE_NUMBER_LENGTH })
        .withMessage(`Phone number must be exactly ${PHONE_NUMBER_LENGTH} digits`)
        .trim()
        .toInt(),
    body('password')
        .notEmpty()
        .withMessage('Password number is required')
        .trim()
        .isLength({ min: PASSWORD_MINIMUM_LENGTH, max: PASSWORD_MAXIMUM_LENGTH })
        .withMessage(
            `Password must be between ${PASSWORD_MINIMUM_LENGTH} and ${PASSWORD_MAXIMUM_LENGTH} characters`,
        )
        .escape(),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(ROLES)
        .withMessage(`Role must be one of ${ROLES.join(', ')}`)
        .trim()
        .escape(),
    body('*').custom(validateAllowedFields(signupAllowedFields)),
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
    body('*').custom(validateAllowedFields(googleAuthAllowedFields)),
];
