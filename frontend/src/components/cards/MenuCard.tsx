import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuModal from '../modal/MenuModal';
import CustomButton from '../Button/CustomButton';
import { IMenu, IUser, UserRole } from '../../types';
import { useAppSelector } from '../../redux/hooks';
import { checkRole } from '../../utils/role';

interface IMenuCardProps {
    menu: IMenu;
    addItemToCartHandler?: (menuItemId: string)=> Promise<void>;
}

const MenuCard: React.FC<IMenuCardProps> = ({ menu, addItemToCartHandler }) => {
    const authData: IUser | null = useAppSelector((store) => store.authReducer.authData);

    const isUser: boolean = checkRole(UserRole.USER, authData?.role);
    const isRestaurant: boolean = checkRole(UserRole.RESTAURANT, authData?.role);

    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const handleEditMenuOpen = () => setIsEditMenuOpen(true);
    const handleEditMenuClose = () => setIsEditMenuOpen(false);
   

    const handleAddToCart = async (): Promise<void> => {
        if (!addItemToCartHandler) {
            return;
        }

        await addItemToCartHandler(menu._id);
    };


    return (
        // <div className="flex justify-center bg-yellow-700">
        <Card sx={{ width: 11 / 12 }}>
            {/* modal start */}
            {menu && isRestaurant && (
                <MenuModal
                    initialValues={menu}
                    isEditMode={true}
                    isOpen={isEditMenuOpen}
                    handleClose={handleEditMenuClose}
                />
            )}
            {/* modal end */}

            <div className="flex flex-col md:flex-row md:justify-between bg-yellow-300 w-full">
                <div className="w-full md:w-80">
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        className="h-5/5 md:h-60 object-cover"
                        image={menu.imageUrl}
                    />
                </div>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <h1 className="text-2xl font-bold text-gray-900">{menu?.name}</h1>
                    </Typography>

                    <p>{menu.description}</p>
                    <div className="flex">
                        <h2 className="text-lg font-semibold mt-4 flex items-center gap-3">
                            <Typography component="span"> Price: </Typography>
                            <Typography
                                component="span"
                                className={`text-yellow-600 ${menu.salePrice ? 'line-through' : ''}`}
                            >
                                ₹{menu.price}
                            </Typography>
                            <Typography component="span" className="text-yellow-600">
                                {menu?.salePrice}
                            </Typography>
                        </h2>
                    </div>
                </CardContent>

                <div className="flex items-center justify-center px-4 py-2">
                    {isUser ? (
                        <Button
                            onClick={handleAddToCart}
                            className="w-full"
                            variant="contained"
                            size="small"
                        >
                            Add to cart
                        </Button>
                    ) : isRestaurant ? (
                        <CustomButton onClick={handleEditMenuOpen}>Edit</CustomButton>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* </div> */}
        </Card>
        // </div>
    );
};

export default MenuCard;
