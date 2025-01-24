import { PieChart } from '@mui/x-charts/PieChart';

import { OrderStatusWithCounts } from '../../types';

type PieChartGraph = {
    statusCounts: OrderStatusWithCounts[];
};

type OrderStatuses = {
    label: string;
    value: number;
};

const PieChartGraph: React.FC<PieChartGraph> = ({ statusCounts }) => {
    const radius: number = 50;
    const itemNb: number = 5;

    const orderStatuses: OrderStatuses[] = statusCounts.map((value: OrderStatusWithCounts) => ({
        label: value.status,
        value: value.count,
    }));

    const valueFormatter = (item: { value: number }): string => `${item.value}%`;

    return (
        <div className="flex items-center h-screen">
            <PieChart
                height={450}
                series={[
                    {
                        data: orderStatuses.slice(0, itemNb),
                        innerRadius: radius,
                        arcLabel: (params) => params.label ?? '',
                        arcLabelMinAngle: 20,
                        valueFormatter,
                    },
                ]}
            />
        </div>
    );
};

export default PieChartGraph;
