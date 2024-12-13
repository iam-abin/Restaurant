import { body, param, ValidationChain } from 'express-validator';

const mongoIdValidator = (
    validatorType: 'param' | 'body',
    mongoIdField: string | string[],
): ValidationChain[] => {
    const validator = validatorType === 'param' ? param : body;
    const idFields: string[] = Array.isArray(mongoIdField) ? mongoIdField : [mongoIdField];
    return idFields.map((idField: string) =>
        validator(idField)
            .notEmpty()
            .withMessage(`'${idField}' is required`)
            .isString()
            .withMessage(`'${idField}' must be a string`)
            .trim()
            .isMongoId()
            .withMessage(`Invalid ID format for '${idField}'`),
    );
};

// Specialized validators using the generic function
export const mongoIdParamsValidator = (mongoIdField: string | string[]) =>
    mongoIdValidator('param', mongoIdField);
export const mongoIdBodyValidator = (mongoIdField: string | string[]) =>
    mongoIdValidator('body', mongoIdField);
