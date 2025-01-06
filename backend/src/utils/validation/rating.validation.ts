import { body, ValidationChain } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';

const minRating: number = 0;
const maxRating: number = 5;

export const addRatingRequestBodyValidator: ValidationChain[] = [
    body('rating')
        .notEmpty()
        .withMessage('rating is required')
        .isNumeric()
        .withMessage('rating must be a number')
        .isFloat({ min: minRating, max: maxRating })
        .withMessage(`rating must be  between ${minRating} and ${maxRating}`),
    ...mongoIdBodyValidator('restaurantId'),
];
