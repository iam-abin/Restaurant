import express, { Router } from 'express';
import { container } from 'tsyringe';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { addRatingRequestBodyValidator } from '../utils';
import { RatingController } from '../controllers';
import { UserRole } from '../types';

const ratingController = container.resolve(RatingController);
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
