import { body, ValidationChain } from 'express-validator';
import { OrderStatus } from '../../types';
import { validateAllowedFields } from './allowed-fields.validation';

const STATUSES: OrderStatus[] = [OrderStatus.PREPARING, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED];

const orderStatusupdateAllowedFields: string[] = ['status'];

export const updateOrderStatusRequestBodyValidator: ValidationChain[] = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isString()
        .withMessage('Status must be a string')
        .trim()
        .isIn(STATUSES)
        .withMessage(`Status must be one of: ${STATUSES.join(', ')}`)
        .escape(), // used to sanitize input by escaping characters that could be used in cross-site scripting (XSS) attacks or other injection vulnerabilities
    body('*').custom(validateAllowedFields(orderStatusupdateAllowedFields)),
];
