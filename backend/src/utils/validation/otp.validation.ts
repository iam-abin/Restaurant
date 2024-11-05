import { body } from 'express-validator';

export const verifyOtpRequestBodyValidator = [
    body('otp')
        .notEmpty()
        .withMessage('Otp is required')
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage('Otp length must be 6')
        .escape(),
    body('userId').isMongoId().withMessage('Invalid ID format').trim().escape(),
];

export const resendOtpRequestBodyValidator = [
    body('userId').isMongoId().withMessage('Invalid ID format').trim().escape(),
];
