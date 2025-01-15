import express, { Router } from 'express';
import { container } from 'tsyringe';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    mongoIdParamsValidator,
    paginationValidator,
    restaurantUpdateValidator,
    searchRequestQueryValidator,
    searchFilterRestaurantValidator,
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

router.get('/search', searchRequestQueryValidator, validateRequest, restaurantController.searchRestaurant);

router.get(
    '/search-filter',
    searchFilterRestaurantValidator,
    validateRequest,
    restaurantController.searchFilterRestaurant,
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

export { router as restaurantRoutes };
