import { useEffect, useState } from 'react';

import { getAdminDashboardApi } from '../../api/apiMethods';
import { IAdminDashboard } from '../../types';
import LineGraph from '../../components/charts/LineGraph';

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
            <LineGraph />
        </div>
    );
};

export default Dashboard;
