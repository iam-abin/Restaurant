import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';

interface IDashboardCardProps {
    title: string;
    number: number;
    icon: JSX.Element;
    description?: string;
}

const DashboardCard: React.FC<IDashboardCardProps> = ({ title, number, icon, description }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg  flex w-64 items-center">
            <div className="p-6 w-11/12 flex ">
                <div className="p-4 w-14 h-14 bg-red-100 rounded-full text-blue-600">
                    {/* <img src={icon} alt="Your SVG" /> */}
                    {icon}
                </div>
                <div className="ml-4">
                    <h3 className="text-gray-600 font-semibold">{title}</h3>
                    <p className="text-2xl font-bold text-gray-800">{number}</p>
                </div>
            </div>
            <div className=" h-full ">
                {description && (
                    <Tooltip title={description} arrow>
                        <InfoIcon style={{ width: 15 }} />
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
