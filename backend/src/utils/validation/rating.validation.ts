import { body } from 'express-validator';
import { mongoIdBodyValidator } from './mongodb-id.validation';

const minRating: number = 1;
const maxRating: number = 5;

export const addRatingRequestBodyValidator = [
    body('rating')
        .notEmpty()
        .withMessage('rating is required')
        .isNumeric()
        .withMessage('rating must be a number')
        .isInt({ min: minRating, max: maxRating })
        .withMessage(`rating must be  between ${minRating} and ${maxRating}`),
    ...mongoIdBodyValidator('restaurantId'),
];

// export const updateRatingRequestBodyValidator = [
//     mongoIdBodyValidator('restaurantId'),
//     body('rating')
//         .notEmpty()
//         .withMessage('rating is required')
//         .isNumeric()
//         .withMessage('rating must be a number')
//         .isInt({ min: 0, max: maxRating })
//         .withMessage(`rating must be  between ${minRating} and ${maxRating}`)
// ];
