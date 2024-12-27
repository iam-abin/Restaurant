import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { searchCuisineValidator } from '../utils';
import { cuisineController } from '../controllers';
import { UserRole } from '../types';

const router: Router = express.Router();
router.get('/', checkCurrentUser, auth(UserRole.USER), cuisineController.getCuisines);

router.get(
    '/search',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    searchCuisineValidator,
    validateRequest,
    cuisineController.searchCuisine,
);
export { router as cuisineRoutes };
