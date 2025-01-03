import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PublicIcon from '@mui/icons-material/Public';
import { Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { IRestaurantCard } from '../../types';

const RestaurantCard = ({ restaurant }: { restaurant: IRestaurantCard }) => {
    return (
        <Card sx={{ width: '100%' }} className="w-full">
            <div className="relative">
                <CardMedia
                    component="img"
                    alt="green iguana"
                    className="w-full h-40  object-cover"
                    image={restaurant.imageUrl}
                />
                <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
                    <Typography className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured
                    </Typography>
                </div>
            </div>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    <h1 className="text-2xl font-bold text-gray-900">{restaurant.restaurantName}</h1>
                </Typography>
                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                    <LocationOnOutlinedIcon className="text-gray-500" />
                    <p className="text-sm">
                        City: <Typography className="font-medium">{restaurant.city}</Typography>
                    </p>
                </div>
                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                    <PublicIcon />
                    <p className="text-sm">
                        Country: <Typography className="font-medium">{restaurant.country}</Typography>
                    </p>
                </div>
                <div className="flex flex-row gap-4 mt-4 flex-wrap">
                    {restaurant.cuisines.map((cuisine: string, index: number) => (
                        <Chip key={index} label={cuisine} variant="filled" />
                    ))}
                </div>
            </CardContent>
            <CardActions className="flex justify-end">
                <Link to={`/user/restaurant/${restaurant._id}`}>
                    <Button variant="contained" size="small">
                        View Menus
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
};

export default RestaurantCard;
