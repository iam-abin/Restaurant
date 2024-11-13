import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { orderController } from '../controllers/order.controller';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    orderController.addOrder,
);

router.get(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    orderController.getMyOrders,
);

// router.get(
//     '/:orderId',
//     checkCurrentUser,
//     auth(ROLES_CONSTANTS.USER),
//     orderController.getOrder,
// );

router.get(
    '/restaurant/:restaurantId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    orderController.getRestaurantOrders,
);

router.patch(
    '/:orderId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    orderController.updateOrderStatus,
);

// router.get(
//     '/:orderId',
//     checkCurrentUser,
//     auth(ROLES_CONSTANTS.USER),
//     orderController.getOrder,
// );

export { router as orderRoute };
