import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { DashboardService } from '../services';
import { IAdminDashboard, IRestaurantDashboard } from '../types';

@autoInjectable()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    public async getRestaurantDashboard(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const dashboardData: IRestaurantDashboard =
            await this.dashboardService.getRestaurantDashboardData(userId);
        res.status(200).json(
            createSuccessResponse('Restaurant Dashboard Data fetched successfully', dashboardData),
        );
    }

    public async getAdminDashboard(req: Request, res: Response): Promise<void> {
        const dashboardData: IAdminDashboard = await this.dashboardService.getAdminDashboardData();
        res.status(200).json(
            createSuccessResponse('Admin Dashboard Data fetched successfully', dashboardData),
        );
    }
}
