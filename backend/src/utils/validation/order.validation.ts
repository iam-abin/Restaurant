import { body } from 'express-validator';

export const updateOrderStatusRequestBodyValidator = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isString()
        .withMessage('Status must be a string')
        .trim()
        .isIn(['preparing', 'outfordelivery', 'delivered'])
        .withMessage('Status must be one of: preparing, outfordelivery, delivered')
        .escape(),
];
