import { useEffect, useState } from 'react';

import { getAdminDashboardApi } from '../../api/apiMethods';
import { IAdminDashboard } from '../../types';
import LineGraph from '../../components/charts/LineGraph';
import DashboardCard from '../../components/cards/DashboardCard';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<IAdminDashboard | null>(null);
    useEffect(() => {
        (async () => {
            const result = await getAdminDashboardApi();
            setDashboardData(result.data as IAdminDashboard);
        })();
    }, []);
    const svgIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A2 2 0 015 16V8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-.121.804M12 15a4 4 0 110-8 4 4 0 010 8zm0 0c-2.485 0-4.5 2.015-4.5 4.5V21h9v-1.5c0-2.485-2.015-4.5-4.5-4.5z"
            />
        </svg>
    );
    return (
        <div className="w-full py-10 bg-red-100">
            <div className=" flex flex-wrap justify-center gap-2">
                <DashboardCard
                    title="Total Turnover"
                    number={dashboardData?.totalTurnover ?? 0}
                    icon={svgIcon}
                    description="Amound earned by all restaurants"
                />
                <DashboardCard
                    title="Total Users"
                    number={dashboardData?.usersCount ?? 0}
                    icon={svgIcon}
                    description="Total number of users"
                />
                <DashboardCard
                    title="Total Restaurants"
                    number={dashboardData?.restaurantsCount ?? 0}
                    icon={svgIcon}
                    description="Total number of restaurants"
                />

                <DashboardCard
                    title="Total Revenue"
                    number={dashboardData?.totalCommission ?? 0}
                    icon={svgIcon}
                    description="Total revenue of the application"
                />
            </div>
            <div className="px-10">
                <LineGraph />
            </div>
        </div>
    );
};

export default Dashboard;
