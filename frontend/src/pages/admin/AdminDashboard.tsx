import { useEffect } from 'react';

import { DashboardCardData, IAdminDashboard } from '../../types';
import LineGraph from '../../components/charts/LineGraph';
import DashboardCard from '../../components/cards/DashboardCard';
import { restaurantIcon, revenueIcon, totalTurnoverIcon, userIcon } from '../../components/icons/Icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAdminDashboard } from '../../redux/thunk/dashboardThunk';

const AdminDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { adminDashboardData }: { adminDashboardData: IAdminDashboard | null } = useAppSelector(
        (store) => store.dashboardReducer,
    );

    useEffect(() => {
        (async () => {
            dispatch(fetchAdminDashboard());
        })();
    }, []);

    const dashboardCardData: DashboardCardData[] = [
        {
            title: 'Total Turnover',
            number: adminDashboardData?.totalTurnover ?? 0,
            icon: totalTurnoverIcon,
            description: 'Amount earned by all restaurants',
        },
        {
            title: 'Total Users',
            number: adminDashboardData?.usersCount ?? 0,
            icon: userIcon,
            description: 'Total number of users',
        },
        {
            title: 'Total Restaurants',
            number: adminDashboardData?.restaurantsCount ?? 0,
            icon: restaurantIcon,
            description: 'Total number of restaurants',
        },
        {
            title: 'Total Revenue',
            number: adminDashboardData?.totalCommission ?? 0,
            icon: revenueIcon,
            description: 'Total revenue of the application',
        },
    ];

    return (
        <div className="w-full py-10 bg-red-100">
            <div className=" flex flex-wrap justify-center gap-2">
                {dashboardCardData.map((cardData: DashboardCardData) => (
                    <DashboardCard
                        key={cardData?.title}
                        title={cardData?.title}
                        number={cardData?.number}
                        icon={cardData?.icon}
                        description={cardData?.description}
                    />
                ))}
            </div>
            <div className="px-10">
                <LineGraph />
            </div>
        </div>
    );
};

export default AdminDashboard;
