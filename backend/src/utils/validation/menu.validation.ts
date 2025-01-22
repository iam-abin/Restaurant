import { body, ValidationChain } from 'express-validator';
import { BadRequestError } from '../../errors';
import { validateAllowedFields } from './allowed-fields.validation';

const nameMinimumLength: number = 3;
const nameMaximumLength: number = 50;

const cuisineNameMinimumLength: number = 4;
const cuisineNameMaximumLength: number = 50;

const descriptionMaximumLength: number = 200;

const minimumPrice: number = 0;
const maxPriceLimit: number = 100000; // Maximum price limit

const menuAllowedFields: string[] = ['name', 'description', 'cuisine', 'price', 'salePrice', 'featured'];

export const addMenuRequestBodyValidator: ValidationChain[] = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: nameMinimumLength, max: nameMaximumLength })
        .withMessage(`Name must be between ${nameMinimumLength} and ${nameMaximumLength} characters long`)
        .escape(),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ max: descriptionMaximumLength })
        .withMessage(`Description must not exceed ${descriptionMaximumLength} characters`),
    body('cuisine')
        .notEmpty()
        .withMessage('Cuisine is required')
        .isString()
        .withMessage('Cuisine must be a string')
        .trim()
        .isLength({ min: cuisineNameMinimumLength, max: cuisineNameMaximumLength })
        .withMessage(
            `Cuisine name must be between ${cuisineNameMinimumLength} and ${cuisineNameMaximumLength} characters long`,
        )
        .escape(),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: minimumPrice, max: maxPriceLimit })
        .withMessage(`Price must be a positive number and less than ${maxPriceLimit}`),
    body('salePrice')
        .notEmpty()
        .withMessage('SalePrice is required')
        .isFloat({ min: minimumPrice, max: maxPriceLimit })
        .withMessage(`SalePrice must be a positive number and less than ${maxPriceLimit}`)
        .custom((value: number, { req }) => {
            if (req.body.price && value > req.body.price) {
                throw new BadRequestError('Saleprice must be less than or equal to the original price');
            }
            return true;
        }),
    body('featured')
        .notEmpty()
        .withMessage('Featured is required')
        .isBoolean()
        .withMessage('Featured must be a boolean'),
    body('*').custom(validateAllowedFields(menuAllowedFields)),
];

export const updateMenuRequestBodyValidator: ValidationChain[] = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: nameMinimumLength, max: nameMaximumLength })
        .withMessage(`Name must be between ${nameMinimumLength} and ${nameMaximumLength} characters long`)
        .escape(),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .trim()
        .isLength({ max: descriptionMaximumLength })
        .withMessage(`Description must not exceed ${descriptionMaximumLength} characters`),
    body('cuisine')
        .optional()
        .isString()
        .withMessage('Cuisine must be a string')
        .trim()
        .isLength({ min: cuisineNameMinimumLength, max: cuisineNameMaximumLength })
        .withMessage(
            `Cuisine name must be between ${cuisineNameMinimumLength} and ${cuisineNameMaximumLength} characters long`,
        )
        .escape(),
    body('price')
        .optional()
        .isFloat({ min: minimumPrice, max: maxPriceLimit })
        .withMessage(`Price must be a positive number and less than ${maxPriceLimit}`),
    body('salePrice')
        .optional()
        .isFloat({ min: minimumPrice, max: maxPriceLimit })
        .withMessage(`SalePrice must be a positive number and less than ${maxPriceLimit}`)
        .custom((value: number, { req }) => {
            if (req.body.price && value > req.body.price) {
                throw new Error('SalePrice must be less than or equal to the original price');
            }
            return true;
        }),
    body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
    body('*').custom(validateAllowedFields(menuAllowedFields)),
];
