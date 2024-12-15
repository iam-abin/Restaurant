import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils';
import { container } from 'tsyringe';
import { DashboardService } from '../services';
import { IAdminDashboard, IRestaurantDashboard } from '../types';

const dashboardService = container.resolve(DashboardService);

class DashboardController {
    public async getRestaurantDashboard(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const dashboardData: IRestaurantDashboard = await dashboardService.getRestaurantDashboardData(userId);
        res.status(200).json(
            createSuccessResponse('Restaurant Dashboard Data fetched successfully', dashboardData),
        );
    }

    public async getAdminDashboard(req: Request, res: Response): Promise<void> {
        const dashboardData: IAdminDashboard = await dashboardService.getAdminDashboardData();
        res.status(200).json(
            createSuccessResponse('Admin Dashboard Data fetched successfully', dashboardData),
        );
    }
}

export const dashboardController = new DashboardController();
