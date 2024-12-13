import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { mongoIdParamsValidator, updateOrderStatusRequestBodyValidator, ROLES_CONSTANTS } from '../utils';
import { orderController } from '../controllers';

const router: Router = express.Router();

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), orderController.getMyOrders);

router.post('/payment/checkout', checkCurrentUser, auth(ROLES_CONSTANTS.USER), orderController.addOrder);

router.post('/webhook', express.raw({ type: 'application/json' }), orderController.confirmOrderStripeWebhook);

router.get(
    '/restaurant/:restaurantId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    mongoIdParamsValidator('restaurantId'),
    validateRequest,
    orderController.getRestaurantOrders,
);

router.patch(
    '/restaurant/status/:orderId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    mongoIdParamsValidator('orderId'),
    updateOrderStatusRequestBodyValidator,
    validateRequest,
    orderController.updateOrderStatus,
);

export { router as orderRoutes };
