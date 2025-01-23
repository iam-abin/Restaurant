import { body, ValidationChain } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';
import { validateAllowedFields } from './allowed-fields.validation';

const forgotPasswordAllowedFields: string[] = ['email'];
const resetPasswordAllowedFields: string[] = ['userId', 'password'];
const verifyTokenAllowedFields: string[] = ['resetToken'];

const RESET_TOKEN_LENGTH: number = 80;
const PASSWORD_MINIMUM_LENGTH: number = 4;
const PASSWORD_MAXIMUM_LENGTH: number = 50;

export const forgotPasswordRequestBodyValidator = [
    body('email').isEmail().withMessage('Email must be valid').toLowerCase().trim().escape(),
    body('*').custom(validateAllowedFields(forgotPasswordAllowedFields)),
];

export const resetPasswordRequestBodyValidator: ValidationChain[] = [
    ...mongoIdBodyValidator('userId'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: PASSWORD_MINIMUM_LENGTH, max: PASSWORD_MAXIMUM_LENGTH })
        .withMessage(
            `Password must be between ${PASSWORD_MINIMUM_LENGTH} and ${PASSWORD_MAXIMUM_LENGTH} characters`,
        )
        .escape(),
    body('*').custom(validateAllowedFields(resetPasswordAllowedFields)),
];

export const verifyTokenRequestBodyValidator: ValidationChain[] = [
    body('resetToken')
        .trim()
        .isLength({ min: RESET_TOKEN_LENGTH, max: RESET_TOKEN_LENGTH })
        .withMessage('invalid reset token')
        .escape(),
    body('*').custom(validateAllowedFields(verifyTokenAllowedFields)),
];
