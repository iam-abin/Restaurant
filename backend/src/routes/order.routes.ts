import express, { Router } from 'express';
import { checkCurrentUser, auth } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { orderController } from '../controllers/order.controller';

const router: Router = express.Router();

router.post('/', checkCurrentUser, orderController.addOrder);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), orderController.getMyOrders);

router.get(
    '/restaurant/:restaurantId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    orderController.getRestaurantOrders,
);

// router.get(
//     '/:orderId',
//     checkCurrentUser,
//     orderController.getOrder,
// );

router.patch(
    '/:orderId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    orderController.updateOrderStatus,
);

export { router as orderRoutes };
