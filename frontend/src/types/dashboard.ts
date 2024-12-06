export interface IOrderStatusWithCounts {
    status: string;
    count: number;
}

export interface IAdminDashboard {
    restaurantsCount: number;
    usersCount: number;
    orderStatuses: IOrderStatusWithCounts[];
    totalTurnover: number;
    totalCommission: number;
}
