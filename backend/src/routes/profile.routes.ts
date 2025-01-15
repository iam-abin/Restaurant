import express, { Router } from 'express';
import { container } from 'tsyringe';
import { ProfileController } from '../controllers';
import {
    paginationValidator,
    searchRequestQueryValidator,
    updateProfileRequestBodyValidator,
} from '../utils';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { UserRole } from '../types';

const profileController = container.resolve(ProfileController);
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

router.get(
    '/search',
    checkCurrentUser,
    auth(UserRole.ADMIN),
    searchRequestQueryValidator,
    validateRequest,
    profileController.searchProfile,
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
