import express, { Router } from 'express';
import { checkCurrentUser, auth } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { orderController } from '../controllers/order.controller';

const router: Router = express.Router();

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), orderController.getMyOrders);

router.post('/payment/checkout', checkCurrentUser, auth(ROLES_CONSTANTS.USER), orderController.addOrder);

router.post('/webhook', express.raw({ type: 'application/json' }), orderController.confirmOrderStripeWebhook);

router.get(
    '/restaurant/:restaurantId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    orderController.getRestaurantOrders,
);

router.patch(
    '/restaurant/:orderId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    orderController.updateOrderStatus,
);

// router.get(
//     '/:orderId',
//     checkCurrentUser,
//     orderController.getOrder,
// );

export { router as orderRoutes };
