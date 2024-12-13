import express, { Router } from 'express';
import { profileController } from '../controllers';
import { ROLES_CONSTANTS, updateProfileRequestBodyValidator } from '../utils';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';

const router: Router = express.Router();

router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), profileController.getProfile);

router.get(
    '/users/:page/:limit',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.ADMIN),
    profileController.getProfiles,
);

router.patch(
    '/',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.USER),
    updateProfileRequestBodyValidator,
    validateRequest,
    profileController.editProfile,
);

export { router as profileRoutes };
