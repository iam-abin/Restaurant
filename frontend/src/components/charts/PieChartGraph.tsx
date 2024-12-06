import { PieChart } from '@mui/x-charts/PieChart';
import { mobileAndDesktopOS, valueFormatter } from './pie-data';
import { IOrderStatusWithCounts } from '../../types';

export default function PieChartGraph({ statusCounts }: { statusCounts: IOrderStatusWithCounts[] }) {
    const radius = 50
    const itemNb = 5

    return (
        <div className="flex items-center h-screen">
            <PieChart
                height={450}
                series={[
                    {
                        data: mobileAndDesktopOS.slice(0, itemNb),
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
