import express, { Router } from 'express';
import { profileController } from '../controllers';
import { paginationValidator, updateProfileRequestBodyValidator } from '../utils';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { UserRole } from '../types';

const router: Router = express.Router();

router.get('/', checkCurrentUser, auth(UserRole.USER), profileController.getProfile);

router.get(
    '/users',
    checkCurrentUser,
    auth(UserRole.ADMIN),
    paginationValidator,
    validateRequest,
    profileController.getProfiles,
);

router.patch(
    '/',
    checkCurrentUser,
    auth(UserRole.USER),
    updateProfileRequestBodyValidator,
    validateRequest,
    profileController.editProfile,
);

export { router as profileRoutes };
