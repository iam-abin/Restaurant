import { body, ValidationChain } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';
import { validateAllowedFields } from './allowed-fields.validation';

const addToCartAllowedFields: string[] = ['itemId', 'restaurantId'];
const updateCartAllowedFields: string[] = ['quantity'];

const CART_MIN_QUANTITY: number = 1;
const CART_MAX_QUANTITY: number = 10;

export const addToCartRequestBodyValidator = [
    ...mongoIdBodyValidator(['itemId', 'restaurantId']),
    body('*').custom(validateAllowedFields(addToCartAllowedFields)),
];

export const updateCartRequestBodyValidator: ValidationChain[] = [
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .isInt({ min: CART_MIN_QUANTITY, max: CART_MAX_QUANTITY })
        .withMessage(`Quantity must be  between ${CART_MIN_QUANTITY} and ${CART_MAX_QUANTITY}`),
    body('*').custom(validateAllowedFields(updateCartAllowedFields)),
];
