import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload, validateRequest } from '../middlewares';
import {
    ROLES_CONSTANTS,
    addMenuRequestBodyValidator,
    updateMenuRequestBodyValidator,
    mongoIdParamsValidator,
} from '../utils';
import { menuController } from '../controllers';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
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
    validateRequest,
    menuController.getMenus,
);

router.patch(
    '/:menuId',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    mongoIdParamsValidator('menuId'),
    updateMenuRequestBodyValidator,
    validateRequest,
    menuController.editMenu,
);

export { router as menuRoutes };
