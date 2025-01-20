import express, { Router } from 'express';
import { container } from 'tsyringe';
import { checkCurrentUser, auth, validateRequest } from '../middlewares';
import { DashboardController } from '../controllers';
import { UserRole } from '../types';
import { dashboardGraphRequestBodyValidator } from '../utils';

const dashboardController = container.resolve(DashboardController);
const router: Router = express.Router();

router.get(
    '/restaurant',
    checkCurrentUser,
    auth(UserRole.RESTAURANT),
    dashboardController.getRestaurantDashboard,
);

router.get('/admin/card', checkCurrentUser, auth(UserRole.ADMIN), dashboardController.getAdminDashboardCards);
router.get(
    '/admin/graph',
    checkCurrentUser,
    auth(UserRole.ADMIN),
    dashboardGraphRequestBodyValidator,
    validateRequest,
    dashboardController.getAdminDashboardGraphs,
);

export { router as dashboardRoutes };
