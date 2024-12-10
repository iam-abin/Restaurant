import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    mongoIdParamsValidator,
    restaurantUpdateValidator,
    ROLES_CONSTANTS,
    searchRestaurantValidator,
} from '../utils';
import { restaurantController } from '../controllers/restaurant.controller';

const router: Router = express.Router();

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getMyRestaurant);

router.get(
    '/restaurants/:page/:limit',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.ADMIN),
    restaurantController.getRestaurants,
);

router.get(
    '/:restaurantId',
    mongoIdParamsValidator('restaurantId'),
    validateRequest,
    checkCurrentUser,
    restaurantController.getARestaurant,
);

router.patch(
    '/',
    restaurantUpdateValidator,
    validateRequest,
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    restaurantController.editRestaurant,
);

router.get(
    '/search/:searchText',
    searchRestaurantValidator,
    validateRequest,
    restaurantController.searchRestaurant,
);

export { router as restaurantRoutes };
