import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { restaurantController } from '../controllers/restaurant.controller';

const router: Router = express.Router();

router.get('/:restaurantId', checkCurrentUser, restaurantController.getARestaurant);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getMyRestaurant);

router.patch(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    restaurantController.editRestaurant,
);

router.get('/search/:searchText', restaurantController.searchRestaurant);

export { router as restaurantRoutes };
