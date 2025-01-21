import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Skeleton } from '@mui/material';

const MenuCardSkeleton: React.FC = () => {
    return (
        <Card className="md:flex w-72 md:w-10/12 relative">
            <div className="absolute top-0 left-0">
                <Skeleton variant="rectangular" width={80} height={34} />
            </div>

            <div className="relative md:w-4/12">
                <Skeleton variant="rectangular" width="100%" height={180} />
            </div>
            <CardContent className="md:w-6/12">
                <Skeleton variant="text" width="60%" height={32} />
                <div className="mt-2 gap-1 flex flex-col items-left text-gray-600 dark:text-gray-400">
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    <Skeleton variant="rounded" width={70} height={25} />
                    <Skeleton variant="rounded" width={40} height={25} />
                </div>
            </CardContent>
            <div className="flex justify-center items-center md:w-3/12">
                <Skeleton variant="text" width="55%" height={80} />
            </div>
        </Card>
    );
};

export default MenuCardSkeleton;
