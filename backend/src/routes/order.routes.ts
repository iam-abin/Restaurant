import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { mongoIdParamsValidator, paginationValidator, updateOrderStatusRequestBodyValidator } from '../utils';
import { orderController } from '../controllers';
import { UserRole } from '../types';

const router: Router = express.Router();

router.get(
    '/',
    checkCurrentUser,
    auth(UserRole.USER),
    paginationValidator,
    validateRequest,
    orderController.getMyOrders,
);

router.post('/payment/checkout', checkCurrentUser, auth(UserRole.USER), orderController.addOrder);

router.post('/webhook', express.raw({ type: 'application/json' }), orderController.confirmOrderStripeWebhook);

router.get(
    '/restaurant/:restaurantId',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    mongoIdParamsValidator('restaurantId'),
    paginationValidator,
    validateRequest,
    orderController.getRestaurantOrders,
);

router.patch(
    '/restaurant/status/:orderId',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    mongoIdParamsValidator('orderId'),
    updateOrderStatusRequestBodyValidator,
    validateRequest,
    orderController.updateOrderStatus,
);

export { router as orderRoutes };
