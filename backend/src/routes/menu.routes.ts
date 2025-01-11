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
    menuController.addMenu,
);

router.get(
    '/:menuId',
    checkCurrentUser,
    mongoIdParamsValidator('menuId'),
    validateRequest,
    menuController.getMenu,
);

router.get(
    '/restaurant/:restaurantId',
    checkCurrentUser,
    mongoIdParamsValidator('restaurantId'),
    paginationValidator,
    validateRequest,
    menuController.getMenus,
);

router.patch(
    '/:menuId',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    multerUpload.single('image'),
    mongoIdParamsValidator('menuId'),
    updateMenuRequestBodyValidator,
    validateRequest,
    menuController.editMenu,
);

export { router as menuRoutes };
