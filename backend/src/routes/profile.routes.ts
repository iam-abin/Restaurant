import express, { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { ROLES_CONSTANTS, updateProfileRequestBodyValidator } from '../utils';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';

const router: Router = express.Router();

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), profileController.getProfile);

router.get('/users', checkCurrentUser, auth(ROLES_CONSTANTS.ADMIN), profileController.getProfiles);

router.patch(
    '/',
    checkCurrentUser,
    updateProfileRequestBodyValidator,
    validateRequest,
    auth(ROLES_CONSTANTS.USER),
    profileController.editProfile,
);

export { router as profileRoutes };
