import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { addRatingRequestBodyValidator } from '../utils';
import { ratingController } from '../controllers';
import { UserRole } from '../types';

const router: Router = express.Router();

router.post(
    '/',
    checkCurrentUser,
    auth(UserRole.USER),
    addRatingRequestBodyValidator,
    validateRequest,
    ratingController.addRating,
);

export { router as ratingRoutes };
