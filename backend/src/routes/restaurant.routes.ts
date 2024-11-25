import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    paramsIdValidator,
    restaurantUpdateValidator,
    ROLES_CONSTANTS,
    searchRestaurantValidator,
} from '../utils';
import { restaurantController } from '../controllers/restaurant.controller';

const router: Router = express.Router();

router.get(
    '/:restaurantId',
    paramsIdValidator('restaurantId'),
    validateRequest,
    checkCurrentUser,
    restaurantController.getARestaurant,
);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getMyRestaurant);

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
