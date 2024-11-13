import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { restaurantController } from '../controllers/restaurant.controller';

const router: Router = express.Router();

router.get('/:restaurantId', checkCurrentUser, restaurantController.getARestaurant);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getMyRestaurant);

router.patch('/:restaurantId', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.updateRestaurant);

// router.get('/orders', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getRestaurantOrder);
// router.get('/order/:orderId/status', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.updateOrderStatus);

export { router as restaurantRoute };
