import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import {
    ROLES_CONSTANTS,
    addToCartRequestBodyValidator,
    paramsIdValidator,
    updateCartRequestBodyValidator,
} from '../utils';
import { cartController } from '../controllers/cart.controller';

const router: Router = express.Router();

router.post(
    '/',
    addToCartRequestBodyValidator,
    validateRequest,
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    cartController.addToCart,
);

router.get(
    '/:restaurantId',
    paramsIdValidator('restaurantId'),
    validateRequest,
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    cartController.getCartItems,
);

router.patch(
    '/:cartItemId',
    paramsIdValidator('cartItemId'),
    updateCartRequestBodyValidator,
    validateRequest,
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    cartController.updateQuantity,
);

router.delete('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cartController.removeCartItems);

router.delete(
    '/:cartItemId',
    paramsIdValidator('cartItemId'),
    validateRequest,
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    cartController.removeCartItem,
);

export { router as cartRoutes };
