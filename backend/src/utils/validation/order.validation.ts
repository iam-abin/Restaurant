import { body } from 'express-validator';

export const updateOrderStatusRequestBodyValidator = [
    body('status')
        .isString()
        .withMessage('Status must be a string')
        .isIn(['preparing', 'outfordelivery', 'delivered'])
        .withMessage('Status must be one of: preparing, outfordelivery, delivered'),
];
