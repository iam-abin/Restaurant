import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse, getCurrentYear } from '../utils';
import { DashboardService } from '../services';
import { IAdminDashboardCard, IAdminDashboardGraph, IJwtPayload, IRestaurantDashboard, Year } from '../types';
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

    public getAdminDashboardCards = async (req: Request, res: Response): Promise<void> => {
        const dashboardData: IAdminDashboardCard = await this.dashboardService.getAdminDashboardCardData();
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Admin Dashboard Data fetched successfully', dashboardData),
        );
    };

    public getAdminDashboardGraphs = async (req: Request, res: Response): Promise<void> => {
        const { year = getCurrentYear() } = req.query as Partial<Year>;
        const dashboardData: IAdminDashboardGraph =
            await this.dashboardService.getAdminDashboardGraphData(year);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Admin Dashboard Data fetched successfully', dashboardData),
        );
    };
}
