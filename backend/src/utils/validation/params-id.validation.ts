import { param } from 'express-validator';

export const paramsIdValidator = (mongoId: string) => [
    param(mongoId).isMongoId().withMessage('Invalid ID format'),
];
