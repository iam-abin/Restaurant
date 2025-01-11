import express, { Router } from 'express';
import { container } from 'tsyringe';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    mongoIdParamsValidator,
    paginationValidator,
    restaurantUpdateValidator,
    searchRestaurantValidator,
} from '../utils';
import { RestaurantController } from '../controllers';
import { UserRole } from '../types';

const restaurantController = container.resolve(RestaurantController);
const router: Router = express.Router();

router.get('/', checkCurrentUser, auth(UserRole.RESTAURANT), restaurantController.getMyRestaurant);

router.get(
    '/restaurants',
    checkCurrentUser,
    auth(UserRole.ADMIN),
    paginationValidator,
    validateRequest,
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
    auth(UserRole.RESTAURANT),
    multerUpload.single('image'),
    restaurantUpdateValidator,
    validateRequest,
    restaurantController.editRestaurant,
);

router.get(
    '/search/:searchText',
    searchRestaurantValidator,
    paginationValidator,
    validateRequest,
    restaurantController.searchRestaurant,
);

export { router as restaurantRoutes };
