import express, { Router } from 'express';

import { checkCurrentUser, auth } from '../middlewares';
import { dashboardController } from '../controllers';
import { UserRole } from '../types';

const router: Router = express.Router();

router.get(
    '/restaurant',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    dashboardController.getRestaurantDashboard,
);

router.get('/admin', checkCurrentUser, auth(UserRole.ADMIN), dashboardController.getAdminDashboard);

export { router as dashboardRoutes };
