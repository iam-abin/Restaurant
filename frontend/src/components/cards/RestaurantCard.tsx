import FriedChicken from "../../assets/fried-chicken-french-fries-black-cement-floor (1).jpg";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicIcon from "@mui/icons-material/Public";
import { Chip } from "@mui/material";
import { Link } from "react-router-dom";

const RestaurantCard = ()=> {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <div className="relative">
                <CardMedia
                    component="img"
                    alt="green iguana"
                    className="w-full h-40  object-cover"
                    image={FriedChicken}
                />
                <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured
                    </span>
                </div>
            </div>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    <h1 className="text-2xl font-bold text-gray-900">
                        KFC store
                    </h1>
                </Typography>
                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                    <LocationOnOutlinedIcon className="text-gray-500" />
                    <p className="text-sm">
                        City: <span className="font-medium">Kochi</span>
                    </p>
                </div>
                <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                    <PublicIcon />
                    <p className="text-sm">
                        Country: <span className="font-medium">India</span>
                    </p>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {["biriyani", "laddu", "samoossa"].map((cuisine: string, index: number) => (
                      <Chip key={index} label={cuisine} className="bg-black" variant="filled" />
                    ))}
                </div>
            </CardContent>
            <CardActions className="flex justify-end">
                <Link to={`/restaurant/${124}`}><Button variant="contained" size="small">View Menus</Button></Link>
            </CardActions>
        </Card>
    );
}

export default RestaurantCard