import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PublicIcon from '@mui/icons-material/Public';
import { Chip } from '@mui/material';
import { IRestaurantCard } from '../../types';
import CustomButton from '../Button/CustomButton';
import { TOP_RATED_RESTAURANT_MINIMUM_VALUE } from '../../constants';

interface IRestaurantCardProps {
    restaurant: IRestaurantCard;
}

const RestaurantCard: React.FC<IRestaurantCardProps> = ({ restaurant }) => {
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
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
            }}
            className="w-full hover:shadow-lg"
        >
            <div className="relative">
                <CardMedia
                    component="img"
                    alt={restaurant.restaurantName || 'Restaurant'}
                    className="w-full h-48 object-cover"
                    image={restaurant.imageUrl || ''}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/default-restaurant-image.jpg'; // Provide a fallback image
                    }}
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
                    style={{ opacity: 0.6 }}
                />
                {restaurant.rating && restaurant.rating > TOP_RATED_RESTAURANT_MINIMUM_VALUE && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-sm font-medium rounded-lg px-3 py-1">
                        Top rated
                    </div>
                )}
            </div>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div" className="text-gray-900">
                    {restaurant.restaurantName}
                </Typography>
                <div className="mt-2 gap-1 flex items-center text-gray-600">
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Typography variant="body2">
                        City: <span className="font-medium">{restaurant.city}</span>
                    </Typography>
                </div>
                <div className="mt-2 gap-1 flex items-center text-gray-600">
                    <PublicIcon fontSize="small" />
                    <Typography variant="body2">
                        Country: <span className="font-medium">{restaurant.country}</span>
                    </Typography>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {restaurant?.cuisines?.map((cuisine, index) => (
                        <Chip
                            key={index}
                            label={cuisine}
                            sx={{
                                fontWeight: 500,
                            }}
                        />
                    ))}
                </div>
            </CardContent>
            <CardActions
                className="flex justify-end p-4"
                sx={{
                    mt: 'auto', // Ensures the CardActions always sticks to the bottom
                }}
            >
                <Link to={`/user/restaurant/${restaurant._id}`} style={{ textDecoration: 'none' }}>
                    <CustomButton>View Menus</CustomButton>
                </Link>
            </CardActions>
        </Card>
    );
};

export default RestaurantCard;
