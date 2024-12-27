import { PieChart } from '@mui/x-charts/PieChart';

import { IOrderStatusWithCounts } from '../../types';

export default function PieChartGraph({ statusCounts }: { statusCounts: IOrderStatusWithCounts[] }) {
    const radius = 50;
    const itemNb = 5;

    const orderStatuses = statusCounts.map((value: IOrderStatusWithCounts) => ({
        label: value.status,
        value: value.count,
    }));

    const valueFormatter = (item: { value: number }) => `${item.value}%`;

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
}
