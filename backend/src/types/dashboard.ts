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

export interface IAdminDashboardCard {
    restaurantsCount: number;
    usersCount: number;
    orderStatuses: IOrderStatusWithCounts[];
    totalTurnover: number;
    totalCommission: number;
    lastSevenDaysUsers: CountByDay[];
    lastSevenDaysRestaurants: CountByDay[];
}

export interface IAdminDashboardGraph {
    restaurantsCountByMonth: CountByMonth[];
    profilesCountByMonth: CountByMonth[];
    minMaxYears: MinMaxYears;
}

type Count = {
    count: number;
};

export type CountByMonth = Count & {
    month: number;
};

export type CountByDay = Count & {
    date: string;
};

export type Year = {
    year: number;
};

export type MinMaxYears = {
    minYear: number | null;
    maxYear: number | null;
};
