export interface IOrderStatusWithCounts {
    status: string;
    count: number;
}

export interface IRestaurantDashboard {
    orderStatusData: IOrderStatusWithCounts[];
    totalRevenue: number;
    menusCount: number;
    cuisinesCount: number;
}

export interface IAdminDashboard {
    restaurantsCount: number;
    usersCount: number;
    orderStatuses: IOrderStatusWithCounts[];
    totalTurnover: number;
    totalCommission: number;
    lastSevenDaysUsers: CountByDay[];
    lastSevenDaysRestaurants: CountByDay[];
}

export type CountByDay = {
    date: string;
    count: number;
};
