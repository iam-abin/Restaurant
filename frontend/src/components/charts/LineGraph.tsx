import { LineChart } from '@mui/x-charts/LineChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// const xWeeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function LineGraph() {
    return (
        <LineChart
            // width={800}
            height={500}
            series={[
                { data: pData, label: 'pv' },
                { data: uData, label: 'uv' },
            ]}
            xAxis={[{ scaleType: 'point', data: xMonths, label: 'Months' }]}
            yAxis={[
                {
                    position: 'left', // You can also use 'right' for a secondary Y axis
                    label: 'Value',
                    min: 0, // Optional: Set minimum value for the Y axis
                    max: 10000, // Optional: Set maximum value for the Y axis
                    // tickCount: 5,     // Optional: Control the number of ticks (steps)
                },
            ]}
        />
    );
}
