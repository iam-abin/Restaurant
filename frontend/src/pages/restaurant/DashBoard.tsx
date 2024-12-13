import { useEffect, useState } from 'react';

import { IOrderStatusWithCounts } from '../../types';
import { getRestaurantDashboardApi } from '../../api/apiMethods';
import PieChartGraph from '../../components/charts/PieChartGraph';

const DashBoard = () => {
    const [statusCounts, setStatusCounts] = useState<IOrderStatusWithCounts[]>([]);
    useEffect(() => {
        (async () => {
            const result = await getRestaurantDashboardApi();
            setStatusCounts(result.data as IOrderStatusWithCounts[]);
        })();
    }, []);
    return (
        <div>
            <PieChartGraph statusCounts={statusCounts} />
        </div>
    );
};

export default DashBoard;
