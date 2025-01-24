import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PublicIcon from '@mui/icons-material/Public';

const RestaurantCardSkeleton: React.FC = () => {
    return (
        <Card
            sx={{
                width: 300,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
            }}
            className="w-full"
        >
            <div className="relative">
                <Skeleton variant="rectangular" width="100%" height={192} />
                <Skeleton
                    variant="text"
                    width={80}
                    height={45}
                    className="absolute top-3 left-3 bg-yellow-500 text-white"
                />
            </div>
            <CardContent sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="80%" height={32} />
                <div className="mt-2 gap-1 flex items-center text-gray-600">
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Skeleton variant="text" width="50%" height={20} />
                </div>
                <div className="mt-2 gap-1 flex items-center text-gray-600">
                    <PublicIcon fontSize="small" />
                    <Skeleton variant="text" width="60%" height={20} />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {[...Array(3)].map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            width={80}
                            height={32}
                            sx={{ borderRadius: 1 }}
                        />
                    ))}
                </div>
            </CardContent>
            <CardActions
                className="flex justify-end p-4"
                sx={{
                    mt: 'auto',
                }}
            >
                <Skeleton variant="rectangular" width={120} height={36} />
            </CardActions>
        </Card>
    );
};

export default RestaurantCardSkeleton;
