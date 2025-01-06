import { body, ValidationChain } from 'express-validator';

const STATUSES: string[] = ['preparing', 'outfordelivery', 'delivered'];

export const updateOrderStatusRequestBodyValidator: ValidationChain[] = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isString()
        .withMessage('Status must be a string')
        .trim()
        .isIn(STATUSES)
        .withMessage(`Status must be one of: ${STATUSES.join(', ')}`)
        .escape(),
];
