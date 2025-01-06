import { body, ValidationChain } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';

export const verifyOtpRequestBodyValidator: ValidationChain[] = [
    body('otp')
        .notEmpty()
        .withMessage('Otp is required')
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage('Otp length must be 6')
        .escape(),
    ...mongoIdBodyValidator('userId'),
];

export const resendOtpRequestBodyValidator: ValidationChain[] = [...mongoIdBodyValidator('userId')];
