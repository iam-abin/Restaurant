import { body, param, ValidationChain } from 'express-validator';

/**
 * Creates a validation chain to validate MongoDB ObjectId fields in request parameters or body.
 */
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

/**
 * Validates MongoDB ObjectId fields in request parameters.
 *
 * @param mongoIdField - A single mongodb id field name or an array of id field name(s) to be validated.
 * @returns An array of validation chains for the specified parameter field(s).
 */
export const mongoIdParamsValidator = (mongoIdField: string | string[]): ValidationChain[] =>
    mongoIdValidator('param', mongoIdField);

/**
 * Validates MongoDB ObjectId fields in the request body.
 *
 * @param mongoIdField - A single mongodb id field name or an array of id field name(s) to be validated.
 * @returns An array of validation chains for the specified body field(s).
 */
export const mongoIdBodyValidator = (mongoIdField: string | string[]): ValidationChain[] =>
    mongoIdValidator('body', mongoIdField);
