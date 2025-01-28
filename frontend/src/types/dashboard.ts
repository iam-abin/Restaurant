type Count = {
    count: number;
};

export type OrderStatusWithCounts = Count & {
    status: string;
};

export type CountByDay = Count & {
    date: string;
};

export type CountByMonth = Count & {
    month: number;
};

export interface IRestaurantDashboard {
    orderStatusData: OrderStatusWithCounts[];
    totalRevenue: number | null;
    menusCount: number | null;
    cuisinesCount: number | null;
    ordersCount: number | null;
}

export interface IAdminDashboardCard {
    restaurantsCount: number;
    usersCount: number;
    totalTurnover: number;
}

export interface IAdminDashboardGraph {
    restaurantsCountByMonth: CountByMonth[];
    profilesCountByMonth: CountByMonth[];
    minMaxYears: MinMaxYears;
}

export type Year = {
    year: number;
};

export type MinMaxYears = {
    minYear: number | null;
    maxYear: number | null;
};

export type DashboardCardData = {
    title: string;
    number: number;
    icon: JSX.Element;
    description?: string;
    symbol?: JSX.Element;
};
