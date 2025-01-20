const DASHBOARD_URL = '/dashboard';

const dashboardApiUrls = {
    getAdminDashboardCardUrl: `${DASHBOARD_URL}/admin/card`,
    getAdminDashboardGraphUrl: (year: number) => `${DASHBOARD_URL}/admin/graph?year=${year}`,
    getRestaurantDashboardUrl: `${DASHBOARD_URL}/restaurant`,
};

export default dashboardApiUrls;
