import FriedChicken from "../../assets/fried-chicken-french-fries-black-cement-floor (1).jpg";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useState } from "react";
import EditMenuModal from "../modal/EditMenuModal";

const MenuCard = () => {
    const isAdmin = true;
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const handleEditMenuOpen = () => setIsEditMenuOpen(true);
    const handleEditMenuClose = () => setIsEditMenuOpen(false);
    return (
        <Card sx={{ maxWidth: 345 }}>
            <EditMenuModal isOpen={isEditMenuOpen} handleClose={handleEditMenuClose} />
            <div className="relative">
                <CardMedia
                    component="img"
                    alt="green iguana"
                    className="w-full h-40  object-cover"
                    image={FriedChicken}
                />
            </div>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    <h1 className="text-2xl font-bold text-gray-900">
                        KFC store
                    </h1>
                </Typography>

                <p>
                    Deliciously crispy, hand-breaded chicken with 11 secret
                    herbs and spices. KFC’s iconic flavor—perfectly juicy, bold,
                    and finger-lickin' good!
                </p>
                <h2 className="text-lg font-semibold mt-4">
                    Price: <span className="text-yellow-600">₹80</span>
                </h2>
            </CardContent>
            <div className="flex items-center justify-center px-4 py-2">
               {!isAdmin?<Link to={`/restaurant/${124}`} className="w-full">
                    <Button className="w-full" variant="contained" size="small">
                       Add to cart
                    </Button>
                </Link>:<Button onClick={handleEditMenuOpen} className="w-full" variant="contained" size="small">
                       Edit
                    </Button>} 
            </div>
        </Card>
    );
};

export default MenuCard;
