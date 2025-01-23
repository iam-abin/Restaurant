import { body, ValidationChain } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';
import { validateAllowedFields } from './allowed-fields.validation';

const OTP_LENGTH: number = 6;

const verifyOtpAllowedFields: string[] = ['otp', 'userId'];
const resendOtpAllowedFields: string[] = ['userId'];

export const verifyOtpRequestBodyValidator: ValidationChain[] = [
    body('otp')
        .notEmpty()
        .withMessage('Otp is required')
        .trim()
        .isLength({ min: OTP_LENGTH, max: OTP_LENGTH })
        .withMessage(`Otp length must be ${OTP_LENGTH}`)
        .escape(),
    ...mongoIdBodyValidator('userId'),
    body('*').custom(validateAllowedFields(verifyOtpAllowedFields)),
];

export const resendOtpRequestBodyValidator: ValidationChain[] = [
    ...mongoIdBodyValidator('userId'),
    body('*').custom(validateAllowedFields(resendOtpAllowedFields)),
];
