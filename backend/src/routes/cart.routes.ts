import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import {
    ROLES_CONSTANTS,
    addToCartRequestBodyValidator,
    mongoIdParamsValidator,
    updateCartRequestBodyValidator,
} from '../utils';
import { cartController } from '../controllers';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    addToCartRequestBodyValidator,
    validateRequest,
    cartController.addToCart,
);

router.get(
    '/:restaurantId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    mongoIdParamsValidator('restaurantId'),
    validateRequest,
    cartController.getCartItems,
);

router.patch(
    '/quantity/:cartItemId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    mongoIdParamsValidator('cartItemId'),
    updateCartRequestBodyValidator,
    validateRequest,
    cartController.updateQuantity,
);

router.delete('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cartController.removeCartItems);

router.delete(
    '/:cartItemId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    mongoIdParamsValidator('cartItemId'),
    validateRequest,
    cartController.removeCartItem,
);

export { router as cartRoutes };
