import express, { Router } from 'express';
import { container } from 'tsyringe';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { mongoIdParamsValidator, paginationValidator, updateOrderStatusRequestBodyValidator } from '../utils';
import { OrderController } from '../controllers';
import { UserRole } from '../types';

const orderController = container.resolve(OrderController);
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

router.post('/stripe/confirm-order', orderController.confirmOrderStripeWebhook);

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
