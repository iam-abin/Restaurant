import { body, param } from 'express-validator';

export const mongoIdParamsValidator = (mongoId: string) => [
    param(mongoId).isMongoId().withMessage('Invalid ID format').notEmpty().withMessage('Item ID is required'),
];

export const mongoIdBodyValidator = (mongoId: string) => [
    body(mongoId).isMongoId().withMessage('Invalid ID format').notEmpty().withMessage('Item ID is required'),
];
