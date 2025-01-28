import express, { Router } from 'express';
import { container } from 'tsyringe';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    addMenuRequestBodyValidator,
    updateMenuRequestBodyValidator,
    mongoIdParamsValidator,
    paginationValidator,
} from '../utils';
import { MenuController } from '../controllers';
import { UserRole } from '../types';

const menuController = container.resolve(MenuController);
const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    multerUpload.single('image'),
    addMenuRequestBodyValidator,
    validateRequest,
    menuController.addMenuItem,
);

router.get(
    '/:menuItemId',
    checkCurrentUser,
    mongoIdParamsValidator('menuItemId'),
    validateRequest,
    menuController.getMenuItem,
);

router.get(
    '/restaurant/:restaurantId',
    checkCurrentUser,
    mongoIdParamsValidator('restaurantId'),
    paginationValidator,
    validateRequest,
    menuController.getMenu,
);

router.patch(
    '/:menuItemId',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    multerUpload.single('image'),
    mongoIdParamsValidator('menuItemId'),
    updateMenuRequestBodyValidator,
    validateRequest,
    menuController.editMenuItem,
);

router.patch(
    '/close-open/:menuItemId',
    mongoIdParamsValidator('menuItemId'),
    validateRequest,
    menuController.closeOpenMenuItem,
);

export { router as menuRoutes };
