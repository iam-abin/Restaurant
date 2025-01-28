import { query, body, ValidationChain } from 'express-validator';
import { paginationValidator } from './pagination.validation';
import { validateAllowedFields } from './allowed-fields.validation';

const NAME_MINIMUM_LENGTH: number = 1;
const NAME_MAXIMUM_LENGTH: number = 50;

const COUNTRY_MINIMUM_LENGTH: number = 2;
const COUNTRY_MAXIMUM_LENGTH: number = 60;

const CITY_MINIMUM_LENGTH: number = 2;
const CITY_MAXIMUM_LENGTH: number = 60;

const MINIMUM_PRODUCT_DELIVERY_TIME_IN_MINUTES: number = 1;
const MAXIMUM_PRODUCT_DELIVERY_TIME_IN_MINUTES: number = 300;

const SEARCH_KEY_LENGTH: number = 100;

const PHONE_NUMBER_LENGTH: number = 10;

const restaurantUpdateAllowedFields: string[] = ['name', 'city', 'country', 'deliveryTime', 'image', 'phone'];

export const restaurantUpdateValidator: ValidationChain[] = [
    body('image').optional().isString().withMessage('Image must be a string').trim(),
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: NAME_MINIMUM_LENGTH, max: NAME_MAXIMUM_LENGTH })
        .withMessage(`Name must be between ${NAME_MINIMUM_LENGTH} and ${NAME_MAXIMUM_LENGTH} characters long`)
        .trim()
        .escape(),
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
    body('deliveryTime')
        .notEmpty()
        .withMessage('Delivery time is required')
        .isInt({
            min: MINIMUM_PRODUCT_DELIVERY_TIME_IN_MINUTES,
            max: MAXIMUM_PRODUCT_DELIVERY_TIME_IN_MINUTES,
        })
        .withMessage(
            `Delivery time must be between ${MINIMUM_PRODUCT_DELIVERY_TIME_IN_MINUTES} and ${MAXIMUM_PRODUCT_DELIVERY_TIME_IN_MINUTES} minutes`,
        ),
    body('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isNumeric()
        .withMessage('Phone number must be numeric')
        .isLength({ min: PHONE_NUMBER_LENGTH, max: PHONE_NUMBER_LENGTH })
        .withMessage(`Phone number must be exactly ${PHONE_NUMBER_LENGTH} digits`)
        .trim()
        .toInt(),
    body('*').custom(validateAllowedFields(restaurantUpdateAllowedFields)),
];

export const searchFilterRestaurantValidator: ValidationChain[] = [
    // Validate the `searchText` in the URL parameter
    query('searchText')
        .notEmpty()
        .withMessage('Search text is required')
        .isString()
        .withMessage('Search text must be a string')
        .trim()
        .isLength({ max: SEARCH_KEY_LENGTH })
        .withMessage(`SearchText must not exceed ${SEARCH_KEY_LENGTH} characters`)
        .escape(),

    // Validate the `cuisinesList` in the query (optional, should be an array if provided)
    query('cuisinesList')
        .optional()
        .isArray()
        .withMessage('Cuisines list must be an array')
        .bail()
        .custom((value) => {
            if (!value.every((item: string) => typeof item === 'string')) {
                throw new Error('Each cuisine must be a string');
            }
            return true;
        }),

    // Validate the `searchQuery` in the query (optional, should be a string)
    query('searchQuery')
        .optional()
        .isString()
        .withMessage('Search query must be a string')
        .trim()
        .isLength({ max: SEARCH_KEY_LENGTH })
        .withMessage(`SearchQuery must not exceed ${SEARCH_KEY_LENGTH} characters`)
        .escape(),
    ...paginationValidator,
];
