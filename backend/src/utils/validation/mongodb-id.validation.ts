import { body, param } from 'express-validator';

export const mongoIdParamsValidator = (mongoIds: string | string[]) => {
    const ids: string[] = Array.isArray(mongoIds) ? mongoIds : [mongoIds];
    return ids.map((id: string) =>
        param(id)
            .isMongoId()
            .withMessage(`Invalid ID format for '${id}'`)
            .notEmpty()
            .withMessage(`'${id}' is required`),
    );
};

export const mongoIdBodyValidator = (mongoId: string) => [
    body(mongoId).isMongoId().withMessage('Invalid ID format').notEmpty().withMessage('Item ID is required'),
];
