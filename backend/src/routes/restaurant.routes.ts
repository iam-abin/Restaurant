import express, { Router } from 'express';
import { checkCurrentUser, auth } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { restaurantController } from '../controllers/restaurant.controller';

const router: Router = express.Router();

router.get('/:restaurantId', checkCurrentUser, restaurantController.getARestaurant);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getMyRestaurant);

router.patch(
    '/:restaurantId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    restaurantController.editRestaurant,
);

export { router as restaurantRoutes };
