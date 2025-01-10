export interface IOrderStatusWithCounts {
    status: string;
    count: number;
}

export interface IOrderStatusWithCounts {
    status: string;
    count: number;
}

export interface IRestaurantDashboard {
    orderStatusData: IOrderStatusWithCounts[];
    totalRevenue: number | null;
    menusCount: number | null;
    cuisinesCount: number | null;
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

export type DashboardCardData = {
    title: string;
    number: number;
    icon: JSX.Element;
    description: string;
};
