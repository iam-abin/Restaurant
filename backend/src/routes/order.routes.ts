import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { orderController } from '../controllers/order.controller';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    orderController.addOrder,
);

// router.get(
//     '/',
//     checkCurrentUser,
//     auth(ROLES_CONSTANTS.USER),
//     orderController.getOrders,
// );

// router.get(
//     '/:orderId',
//     checkCurrentUser,
//     auth(ROLES_CONSTANTS.USER),
//     orderController.getOrder,
// );

export { router as orderRoute };
