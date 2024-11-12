import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { restaurantController } from '../controllers/restaurant.controller';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    restaurantController.addRestaurant,
);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getMyRestaurant);
router.get(
    '/:restaurantId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    restaurantController.getARestaurant,
);
// router.get('/orders', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.getRestaurantOrder);
// router.get('/order/:orderId/status', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), restaurantController.updateOrderStatus);

export { router as restaurantRoute };
