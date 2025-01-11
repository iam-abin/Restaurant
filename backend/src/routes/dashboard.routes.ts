import express, { Router } from 'express';
import { container } from 'tsyringe';
import { checkCurrentUser, auth } from '../middlewares';
import { DashboardController } from '../controllers';
import { UserRole } from '../types';

const dashboardController = container.resolve(DashboardController);
const router: Router = express.Router();

router.get(
    '/restaurant',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    dashboardController.getRestaurantDashboard,
);

router.get('/admin', checkCurrentUser, auth(UserRole.ADMIN), dashboardController.getAdminDashboard);

export { router as dashboardRoutes };
