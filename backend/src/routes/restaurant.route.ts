import express, { Router } from 'express';
import { checkCurrentUser } from '../middlewares/check-current-user.middleware';
import { auth } from '../middlewares';
import { ROLES } from '../utils';
import { restaurantController } from '../controllers/restaurant.controller';
import { multerUpload } from '../middlewares/multer.middleware';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES.RESTAURANT),
    multerUpload.single('image'),
    restaurantController.addRestaurant,
);

router.get('/', checkCurrentUser, auth(ROLES.RESTAURANT), restaurantController.getMyRestaurant);
router.get('/:restaurantId', checkCurrentUser, auth(ROLES.USER), restaurantController.getARestaurant);
// router.get('/orders', checkCurrentUser, auth(ROLES.RESTAURANT), restaurantController.getRestaurantOrder);
// router.get('/order/:orderId/status', checkCurrentUser, auth(ROLES.RESTAURANT), restaurantController.updateOrderStatus);

export { router as restaurantRoute };
