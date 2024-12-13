import express, { Router } from 'express';

import { checkCurrentUser, auth } from '../middlewares';
import { ROLES_CONSTANTS } from '../utils';
import { dashboardController } from '../controllers';

const router: Router = express.Router();

router.get(
    '/restaurant',
    checkCurrentUser,
    auth(ROLES_CONSTANTS.RESTAURANT),
    dashboardController.getRestaurantDashboard,
);

router.get('/admin', checkCurrentUser, auth(ROLES_CONSTANTS.ADMIN), dashboardController.getAdminDashboard);

export { router as dashboardRoutes };
