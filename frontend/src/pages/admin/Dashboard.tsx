import { useEffect, useState } from 'react';
import { getAdminDashboardApi } from '../../api/apiMethods/dashboard';
import { IAdminDashboard } from '../../types';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<IAdminDashboard | null>(null);
    useEffect(() => {
        (async () => {
            const result = await getAdminDashboardApi();
            setDashboardData(result.data as IAdminDashboard);
        })();
    }, []);
    return (
        <div className="w-full h-screen bg-red-100">
            Dashboard
            {dashboardData?.totalTurnover}
        </div>
    );
};

export default Dashboard;
