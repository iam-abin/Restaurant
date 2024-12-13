import express, { Router } from 'express';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { ROLES_CONSTANTS, searchCuisineValidator } from '../utils';
import { cuisineController } from '../controllers/cuisine.controller';

const router: Router = express.Router();

router.get(
    '/search',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    searchCuisineValidator,
    validateRequest,
    cuisineController.searchCuisine,
);
export { router as cuisineRoutes };
