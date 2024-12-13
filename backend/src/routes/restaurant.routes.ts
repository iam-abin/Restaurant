import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    mongoIdParamsValidator,
    restaurantUpdateValidator,
    ROLES_CONSTANTS,
    searchRestaurantValidator,
} from '../utils';
import { restaurantController } from '../controllers';

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
    checkCurrentUser,
    mongoIdParamsValidator('restaurantId'),
    validateRequest,
    restaurantController.getARestaurant,
);

router.patch(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    restaurantUpdateValidator,
    validateRequest,
    restaurantController.editRestaurant,
);

router.get(
    '/search/:searchText',
    searchRestaurantValidator,
    validateRequest,
    restaurantController.searchRestaurant,
);

export { router as restaurantRoutes };
