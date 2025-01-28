import { useEffect, useState } from 'react';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import { DashboardCardData, IResponse, IRestaurantDashboard } from '../../types';
import { getRestaurantDashboardApi } from '../../api/apiMethods';
import PieChartGraph from '../../components/charts/PieChartGraph';
import DashboardCard from '../../components/cards/DashboardCard';
import {
    cuisineIcon,
    menuIcon,
    ordersIcon,
    totalTurnoverIcon,
} from '../../components/icons/dashboardCard/SvgIcons';

const RestaurantDashBoard: React.FC = () => {
    const [restaurantDashboardData, setRestaurantDashboardData] = useState<IRestaurantDashboard>({
        orderStatusData: [],
        totalRevenue: null,
        menusCount: null,
        cuisinesCount: null,
        ordersCount: null,
    });
    useEffect(() => {
        (async () => {
            const response: IResponse = await getRestaurantDashboardApi();
            setRestaurantDashboardData(response.data as IRestaurantDashboard);
        })();
    }, []);

    const dashboardCardData: DashboardCardData[] = [
        {
            title: 'Total Revenue',
            number: restaurantDashboardData?.totalRevenue ?? 0,
            icon: totalTurnoverIcon,
            description: 'Total Revenue amount',
            symbol: <CurrencyRupeeIcon />,
        },
        {
            title: 'Total Menus',
            number: restaurantDashboardData?.menusCount ?? 0,
            icon: menuIcon,
            description: 'Total number of menus available',
        },
        {
            title: 'Total Cuisines',
            number: restaurantDashboardData?.cuisinesCount ?? 0,
            icon: cuisineIcon,
            description: 'Total number of cuisines available',
        },
        {
            title: 'Total Orders',
            number: restaurantDashboardData?.ordersCount ?? 0,
            icon: ordersIcon,
            description: 'Total orders received',
        },
    ];

    return (
        <div className="w-full py-10">
            {/* Cards */}
            <div className=" flex flex-wrap justify-center gap-2">
                {dashboardCardData.map((cardData: DashboardCardData) => (
                    <DashboardCard
                        key={cardData?.title}
                        title={cardData?.title}
                        number={cardData?.number}
                        icon={cardData?.icon}
                        description={cardData?.description}
                        symbol={cardData?.symbol}
                    />
                ))}
            </div>
            {/* PieChart */}
            <PieChartGraph statusCounts={restaurantDashboardData.orderStatusData} />
        </div>
    );
};

export default RestaurantDashBoard;
