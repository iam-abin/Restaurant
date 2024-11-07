import express, { Router } from 'express';
import { checkCurrentUser } from '../middlewares/check-current-user.middleware';
import { auth } from '../middlewares';
import { ROLES } from '../utils';
import { menuController } from '../controllers/menu.controller';
import { multerUpload } from '../middlewares/multer.middleware';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(ROLES.RESTAURANT),
    multerUpload.single('image'),
    menuController.addMenu,
);

router.get(
    '/',
    checkCurrentUser,
    auth(ROLES.RESTAURANT),
    menuController.addMenu,
);

export { router as menuRoute };
