import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import MenuModal from '../modal/MenuModal';
import CustomButton from '../Button/CustomButton';
import { IMenu, IUser, UserRole } from '../../types';
import { useAppSelector } from '../../redux/hooks';
import { checkRole } from '../../utils/role';

interface IMenuCardProps {
    menu: IMenu;
    addItemToCartHandler?: (menuItemId: string) => Promise<void>;
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
        <Card
            sx={{
                width: {
                    sm: 12 / 12,
                    md: 11 / 12,
                    lg: 10 / 12,
                },
            }}
        >
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
                        // className="h-5/5 md:h-60 object-cover"
                        sx={{
                            height: 200, // Fixed height
                            width: {
                                sm: 300,
                                md: 200,
                            }, // Width relative to the container
                            objectFit: 'fill', // Maintains aspect ratio
                        }}
                        image={menu.imageUrl}
                    />
                </div>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <h1 className="text-2xl font-bold text-gray-900">{menu?.name}</h1>
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3, // Limit to 3 lines
                            WebkitBoxOrient: 'vertical',
                            width: {
                                xs: 100, // Full width on extra-small screens
                                sm: 100,
                                md: 450, // Fixed width on medium and larger screens
                            },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                        }}
                    >
                        {menu.description}
                    </Typography>
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
                        <CustomButton onClick={handleAddToCart}>Add to cart</CustomButton>
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
