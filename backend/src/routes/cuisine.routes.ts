import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { ROLES_CONSTANTS, searchCuisineValidator } from '../utils';
import { cuisineController } from '../controllers';

const router: Router = express.Router();
router.get('/', checkCurrentUser, auth(ROLES_CONSTANTS.USER), cuisineController.getCuisines);

router.get(
    '/search',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    searchCuisineValidator,
    validateRequest,
    cuisineController.searchCuisine,
);
export { router as cuisineRoutes };
