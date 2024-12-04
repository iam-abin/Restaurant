import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { mobileAndDesktopOS, valueFormatter } from './pie-data';

export default function PieChartGraph() {
    const [radius, setRadius] = React.useState(50);
    const [itemNb, setItemNb] = React.useState(5);
    const [skipAnimation, setSkipAnimation] = React.useState(false);

    const handleItemNbChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number') {
            return;
        }
        setItemNb(newValue);
    };
    const handleRadius = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number') {
            return;
        }
        setRadius(newValue);
    };

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
                skipAnimation={skipAnimation}
            />
        </div>
    );
}
