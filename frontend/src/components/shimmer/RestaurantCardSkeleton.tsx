import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Skeleton } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PublicIcon from '@mui/icons-material/Public';

export default function RestaurantCardSkeleton() {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <div className="relative">
                <Skeleton variant="rectangular" width="100%" height={160} />
                <Skeleton variant="text" width={60} height={24} className="absolute top-2 left-2" />
            </div>
            <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                    <LocationOnOutlinedIcon className="text-gray-500" />
                    <Skeleton variant="text" width="40%" height={20} />
                </div>
                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                    <PublicIcon />
                    <Skeleton variant="text" width="50%" height={20} />
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    <Skeleton variant="rounded" width={60} height={32} />
                    <Skeleton variant="rounded" width={60} height={32} />
                    <Skeleton variant="rounded" width={60} height={32} />
                </div>
            </CardContent>
            <CardActions className="flex justify-end">
                <Skeleton variant="rectangular" width={100} height={36} />
            </CardActions>
        </Card>
    );
}
