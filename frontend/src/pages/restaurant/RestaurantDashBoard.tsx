import { useEffect, useState } from 'react';

import { IResponse, IRestaurantDashboard } from '../../types';
import { getRestaurantDashboardApi } from '../../api/apiMethods';
import PieChartGraph from '../../components/charts/PieChartGraph';
import DashboardCard from '../../components/cards/DashboardCard';

const RestaurantDashBoard: React.FC = () => {
    const [restaurantDashboardData, setRestaurantDashboardData] = useState<IRestaurantDashboard>({
        orderStatusData: [],
        totalRevenue: null,
        menusCount: null,
        cuisinesCount: null,
    });
    useEffect(() => {
        (async () => {
            const response: IResponse = await getRestaurantDashboardApi();
            setRestaurantDashboardData(response.data as IRestaurantDashboard);
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
        <div className="w-full py-10">
            {/* Cards */}
            <div className=" flex flex-wrap justify-center gap-2">
                <DashboardCard
                    title="Total Revenue"
                    number={restaurantDashboardData?.totalRevenue ?? 0}
                    icon={svgIcon}
                    description="Total Revenue amount"
                />
                <DashboardCard
                    title="Total Menus"
                    number={restaurantDashboardData?.menusCount ?? 0}
                    icon={svgIcon}
                    description="Total number of menus available"
                />

                <DashboardCard
                    title="Total Cuisines"
                    number={restaurantDashboardData?.cuisinesCount ?? 0}
                    icon={svgIcon}
                    description="Total number of cuisines available"
                />
            </div>
            {/* PieChart */}
            <PieChartGraph statusCounts={restaurantDashboardData.orderStatusData} />
        </div>
    );
};

export default RestaurantDashBoard;
