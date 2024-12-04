import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    ROLES_CONSTANTS,
    addMenuRequestBodyValidator,
    updateMenuRequestBodyValidator,
    mongoIdParamsValidator,
} from '../utils';
import { menuController } from '../controllers/menu.controller';

const router: Router = express.Router();

router.post(
    '/',
    addMenuRequestBodyValidator,
    checkCurrentUser,
    validateRequest,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    menuController.addMenu,
);

router.get(
    '/:menuId',
    mongoIdParamsValidator('menuId'),
    validateRequest,
    checkCurrentUser,
    menuController.getMenu,
);

router.get(
    '/restaurant/:restaurantId',
    mongoIdParamsValidator('restaurantId'),
    validateRequest,
    checkCurrentUser,
    menuController.getMenus,
);

router.patch(
    '/:menuId',
    mongoIdParamsValidator('menuId'),
    updateMenuRequestBodyValidator,
    validateRequest,
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    menuController.editMenu,
);

export { router as menuRoutes };
