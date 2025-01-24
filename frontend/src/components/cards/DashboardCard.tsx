import { Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DashboardCardData } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IDashboardCardProps extends DashboardCardData {}

const DashboardCard: React.FC<IDashboardCardProps> = ({ title, number, icon, description, symbol }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg  flex w-64 items-center">
            <div className="p-6 w-11/12 flex ">
                <div className="p-4 w-14 h-14 bg-red-100 rounded-full text-blue-600">{icon}</div>
                <div className="ml-4">
                    <h3 className="text-gray-600 font-semibold">{title}</h3>
                    <div className="flex items-center text-2xl font-bold text-gray-800">
                        <div className="text-sm">{symbol}</div>
                        <div>{number}</div>
                    </div>
                </div>
            </div>
            <div className=" h-full ">
                {description && (
                    <Tooltip title={description} sx={{ width: 14 }} arrow>
                        <InfoIcon />
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
