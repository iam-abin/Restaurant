import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { DashboardService } from '../services';
import { IAdminDashboard, IJwtPayload, IRestaurantDashboard } from '../types';
import { HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    public getRestaurantDashboard = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const dashboardData: IRestaurantDashboard =
            await this.dashboardService.getRestaurantDashboardData(userId);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Restaurant Dashboard Data fetched successfully', dashboardData),
        );
    };

    public getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
        const dashboardData: IAdminDashboard = await this.dashboardService.getAdminDashboardData();
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Admin Dashboard Data fetched successfully', dashboardData),
        );
    };
}
