import { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import { CountByMonth, DashboardCardData, IAdminDashboardCard, IAdminDashboardGraph } from '../../types';
import LineGraph from '../../components/charts/LineGraph';
import DashboardCard from '../../components/cards/DashboardCard';
import { restaurantIcon, totalTurnoverIcon, userIcon } from '../../components/icons/Icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAdminDashboardCard, fetchAdminDashboardGraph } from '../../redux/thunk/dashboardThunk';

const AdminDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        adminDashboardCardData,
        adminDashboardGraphData,
    }: {
        adminDashboardCardData: IAdminDashboardCard | null;
        adminDashboardGraphData: IAdminDashboardGraph | null;
    } = useAppSelector((store) => store.dashboardReducer);

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Default to current year

    // Fetch initial data
    useEffect(() => {
        dispatch(fetchAdminDashboardCard());
        dispatch(fetchAdminDashboardGraph({ year: selectedYear }));
    }, [dispatch, selectedYear]);

    const dashboardCardData: DashboardCardData[] = [
        {
            title: 'Total Turnover',
            number: adminDashboardCardData?.totalTurnover ?? 0,
            icon: totalTurnoverIcon,
            description: 'Amount earned by all restaurants',
            symbol: <CurrencyRupeeIcon style={{ fontSize: '0.85rem' }} />,
        },
        {
            title: 'Total Users',
            number: adminDashboardCardData?.usersCount ?? 0,
            icon: userIcon,
            description: 'Total number of users',
        },
        {
            title: 'Total Restaurants',
            number: adminDashboardCardData?.restaurantsCount ?? 0,
            icon: restaurantIcon,
            description: 'Total number of restaurants',
        },
    ];

    const mapCountByMonth = (countByMonth: CountByMonth[] = []): number[] => {
        const numberOfMonths: number = 12; // Total months in a year
        const monthArray: number[] = new Array(numberOfMonths).fill(0); // Ensure `monthArray` is reset for each call

        countByMonth.forEach((currentCountByMonth) => {
            if (currentCountByMonth && currentCountByMonth.month <= numberOfMonths) {
                // Adjust month index and update the array
                monthArray[currentCountByMonth.month - 1] = currentCountByMonth.count;
            }
        });

        return monthArray;
    };

    const handleYearChange = (event: SelectChangeEvent<number>): void => {
        const year: number = parseInt(event.target.value as unknown as string, 10);
        setSelectedYear(year);
    };

    return (
        <div className="w-full py-6 bg-red-100">
            <div className="flex flex-wrap justify-center gap-2">
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
            <div className="px-10 pt-10 flex justify-end items-center">
                <span>
                    <Tooltip title={'Number of registered users and restaurants graph based on years'} arrow>
                        <InfoIcon style={{ width: 15 }} />
                    </Tooltip>
                </span>
                <FormControl variant="outlined" size="small" className="w-40">
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                        labelId="year-select-label"
                        value={selectedYear} // Convert to string for compatibility
                        onChange={handleYearChange}
                        label="Year"
                    >
                        {adminDashboardGraphData?.minMaxYears &&
                            Array.from(
                                {
                                    length:
                                        (adminDashboardGraphData.minMaxYears.maxYear ?? 0) -
                                        (adminDashboardGraphData.minMaxYears.minYear ?? 0) +
                                        1,
                                },
                                (_, index) => (adminDashboardGraphData.minMaxYears.minYear ?? 0) + index,
                            ).map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
            <div className="px-10">
                {adminDashboardGraphData && (
                    <LineGraph
                        countRestaurantsByMonthArray={mapCountByMonth(
                            adminDashboardGraphData?.restaurantsCountByMonth,
                        )}
                        countProfilesByMonthArray={mapCountByMonth(
                            adminDashboardGraphData?.profilesCountByMonth,
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
