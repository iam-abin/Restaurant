import { useEffect, useState } from 'react';
import { getAdminDashboardApi } from '../../api/apiMethods/dashboard';
import { IAdminDashboard } from '../../types';

const Dashboard = () => {
    const [statusCounts, setStatusCounts] = useState<IAdminDashboard | null>(null);
    useEffect(() => {
        (async () => {
            const result = await getAdminDashboardApi();
            setStatusCounts(result.data as IAdminDashboard);
        })();
    }, []);
    return <div className="w-full h-screen bg-red-100">Dashboard</div>;
};

export default Dashboard;
