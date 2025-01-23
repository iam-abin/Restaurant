import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MenuModal from '../modal/MenuModal';
import CustomButton from '../Button/CustomButton';
import { IMenu, IUser, UserRole } from '../../types';
import { useAppSelector } from '../../redux/hooks';
import { checkRole } from '../../utils';

interface IMenuCardProps {
    menu: IMenu;
    addItemToCartHandler?: (menuItemId: string) => Promise<void>;
}

const MenuCard: React.FC<IMenuCardProps> = ({ menu, addItemToCartHandler }) => {
    const authData: IUser | null = useAppSelector((store) => store.authReducer.authData);

    const isUser: boolean = checkRole(UserRole.USER, authData?.role);
    const isRestaurant: boolean = checkRole(UserRole.RESTAURANT, authData?.role);

    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const handleEditMenuOpen = (): void => setIsEditMenuOpen(true);
    const handleEditMenuClose = (): void => setIsEditMenuOpen(false);

    const handleAddToCart = async (): Promise<void> => {
        if (!addItemToCartHandler) {
            return;
        }

        await addItemToCartHandler(menu._id);
    };

    return (
        <Card className="w-72 md:w-10/12">
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

            <div className="relative flex flex-col md:flex-row md:justify-between bg-yellow-300 w-full">
                {/* Featured Card */}
                {menu.featured && (
                    <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold p-2">
                        Featured
                    </div>
                )}

                <div className="xs:w-6/8 md:w-72">
                    <img src={menu.imageUrl} alt={menu.name} className="w-full h-48 object-cover" />
                </div>

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <h1 className="text-2xl font-bold text-gray-900">{menu?.name}</h1>
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: {
                                xs: 3,
                                sm: 2,
                            },
                            WebkitBoxOrient: 'vertical',
                            width: {
                                xs: '100%',
                                // custom: 450,
                                sm: '100%',
                                md: 450,
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
                        <CustomButton onClick={handleEditMenuOpen} className="sm:w-full">
                            Edit
                        </CustomButton>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default MenuCard;
