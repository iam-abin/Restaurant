import express, { Router } from 'express';
import { checkCurrentUser } from '../middlewares/check-current-user.middleware';
import { auth } from '../middlewares';
import { ROLES } from '../utils';
import { orderController } from '../controllers/order.controller';
import { multerUpload } from '../middlewares/multer.middleware';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES.RESTAURANT),
    multerUpload.single('image'),
    orderController.addOrder,
);

// router.get(
//     '/',
//     checkCurrentUser,
//     auth(ROLES.USER),
//     orderController.getOrders,
// );

// router.get(
//     '/:orderId',
//     checkCurrentUser,
//     auth(ROLES.USER),
//     orderController.getOrder,
// );

export { router as orderRoute };
