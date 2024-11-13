import express, { Router } from 'express';
import { checkCurrentUser, auth, multerUpload } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { menuController } from '../controllers/menu.controller';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    multerUpload.single('image'),
    menuController.addMenu,
);

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.RESTAURANT), menuController.addMenu);

export { router as menuRoute };
