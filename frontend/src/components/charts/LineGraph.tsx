import { LineChart } from '@mui/x-charts/LineChart';
import { getNextPowerOfTen } from '../../utils';
import { months } from '../../constants';

type LineGraphProps = {
    countRestaurantsByMonthArray: number[];
    countProfilesByMonthArray: number[];
};

export const LineGraph: React.FC<LineGraphProps> = ({
    countRestaurantsByMonthArray,
    countProfilesByMonthArray,
}) => {
    // To find maximum value in the y axis and its nearest 10's power
    const restaurantsTensPower: number[] = [getNextPowerOfTen(Math.max(...countRestaurantsByMonthArray))];
    const profilesTensPower: number[] = [getNextPowerOfTen(Math.max(...countProfilesByMonthArray))];
    const maxValue = Math.max(...restaurantsTensPower, ...profilesTensPower);

    return (
        <LineChart
            height={470}
            series={[
                {
                    data: countRestaurantsByMonthArray,
                    label: 'restaurants',
                    color: 'green',
                },
                {
                    data: countProfilesByMonthArray,
                    label: 'users',
                    color: 'blue',
                },
            ]}
            xAxis={[{ scaleType: 'point', data: months, label: 'Months' }]}
            yAxis={[
                {
                    position: 'left', // You can also use 'right' for a secondary Y axis
                    label: 'Account creation count',
                    min: 0, // Optional: Set minimum value for the Y axis
                    max: maxValue, // Optional: Set maximum value for the Y axis
                    // tickCount: 5,     // Optional: Control the number of ticks (steps)
                },
            ]}
        />
    );
};

export default LineGraph;
