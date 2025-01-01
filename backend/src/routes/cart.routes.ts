import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import {
    addToCartRequestBodyValidator,
    mongoIdParamsValidator,
    paginationValidator,
    updateCartRequestBodyValidator,
} from '../utils';
import { cartController } from '../controllers';
import { UserRole } from '../types';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(UserRole.USER),
    addToCartRequestBodyValidator,
    validateRequest,
    cartController.addToCart,
);

router.get(
    '/:restaurantId',
    checkCurrentUser,
    auth(UserRole.USER),
    mongoIdParamsValidator('restaurantId'),
    paginationValidator,
    validateRequest,
    cartController.getCartItems,
);

router.patch(
    '/quantity/:cartItemId',
    checkCurrentUser,
    auth(UserRole.USER),
    mongoIdParamsValidator('cartItemId'),
    updateCartRequestBodyValidator,
    validateRequest,
    cartController.updateQuantity,
);

router.delete('/', checkCurrentUser, auth(UserRole.USER), cartController.removeCartItems);

router.delete(
    '/:cartItemId',
    checkCurrentUser,
    auth(UserRole.USER),
    mongoIdParamsValidator('cartItemId'),
    validateRequest,
    cartController.removeCartItem,
);

export { router as cartRoutes };
