import express, { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { ROLES_CONSTANTS } from '../utils';
import { checkCurrentUser, auth } from '../middlewares';

const router: Router = express.Router();

router.get('/profile', checkCurrentUser, auth(ROLES_CONSTANTS.USER), profileController.getProfile);

router.patch('/profile', checkCurrentUser, auth(ROLES_CONSTANTS.USER), profileController.editProfile);

export { router as profileRoutes };
