import express, { Router } from 'express';
import { checkCurrentUser, auth } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { cartController } from '../controllers/cart.controller';

const router: Router = express.Router();

router.post('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cartController.addToCart);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cartController.getCartItems);

router.patch('/:cartItemId', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cartController.updateQuantity);

router.delete('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cartController.removeCartItems);

router.delete('/:cartItemId', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cartController.removeCartItem);

export { router as cartRoutes };
