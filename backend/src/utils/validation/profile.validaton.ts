import { body, ValidationChain } from 'express-validator';
import { validateAllowedFields } from './allowed-fields.validation';
import {
    ADDRESS_MAXIMUM_LENGTH,
    ADDRESS_MINIMUM_LENGTH,
    CITY_MAXIMUM_LENGTH,
    CITY_MINIMUM_LENGTH,
    COUNTRY_MAXIMUM_LENGTH,
    COUNTRY_MINIMUM_LENGTH,
    NAME_MAXIMUM_LENGTH,
    NAME_MINIMUM_LENGTH,
} from '../../constants';

const profileAllowedFields: string[] = ['image', 'name', 'address', 'city', 'country'];

export const updateProfileRequestBodyValidator: ValidationChain[] = [
    body('image').optional().isString().withMessage('Image must be a string').trim(),
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: NAME_MINIMUM_LENGTH, max: NAME_MAXIMUM_LENGTH })
        .withMessage(`Name must be between ${NAME_MINIMUM_LENGTH} and ${NAME_MAXIMUM_LENGTH} characters long`)
        .escape(),
    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .isString()
        .withMessage('Address must be a string')
        .isLength({ min: ADDRESS_MINIMUM_LENGTH, max: ADDRESS_MAXIMUM_LENGTH })
        .withMessage(
            `Address must be between ${ADDRESS_MINIMUM_LENGTH} and ${ADDRESS_MAXIMUM_LENGTH} characters long`,
        )
        .trim(),
    body('city')
        .notEmpty()
        .withMessage('City is required')
        .isString()
        .withMessage('City must be a string')
        .isLength({ min: CITY_MINIMUM_LENGTH, max: CITY_MAXIMUM_LENGTH })
        .withMessage(
            `City name must be between ${CITY_MINIMUM_LENGTH} and ${CITY_MAXIMUM_LENGTH} characters long`,
        )
        .trim()
        .escape(),
    body('country')
        .notEmpty()
        .withMessage('Country is required')
        .isString()
        .withMessage('Country must be a string')
        .isLength({ min: COUNTRY_MINIMUM_LENGTH, max: COUNTRY_MAXIMUM_LENGTH })
        .withMessage(
            `Country must be between ${COUNTRY_MINIMUM_LENGTH} and ${COUNTRY_MAXIMUM_LENGTH} characters long`,
        )
        .trim()
        .escape(),
    body('*').custom(validateAllowedFields(profileAllowedFields)),
];
