import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import MenuModal from '../modal/MenuModal';
import { IMenu } from '../../types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ROLES_CONSTANTS } from '../../utils/constants';
import { addToCart } from '../../redux/thunk/cartThunk';
import { useParams } from 'react-router-dom';
import { hotToastMessage } from '../../utils/hotToast';

const MenuCard = ({ menu }: { menu: IMenu }) => {
    const authData = useAppSelector((store) => store.authReducer.authData);
    const isUser = authData?.role === ROLES_CONSTANTS.USER;
    const isRestaurant = authData?.role === ROLES_CONSTANTS.RESTAURANT;

    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const handleEditMenuOpen = () => setIsEditMenuOpen(true);
    const handleEditMenuClose = () => setIsEditMenuOpen(false);
    const dispatch = useAppDispatch();
    const params = useParams();

    const addItemToCartHandler = async (menuItemId: string) => {
        const response = await dispatch(
            addToCart({ itemId: menuItemId, restaurantId: params.restaurantId! }),
        );
        if (response.meta.requestStatus === 'rejected') {
            hotToastMessage(response.payload as string, 'error');
        }
    };

    return (
        // <div className="flex justify-center bg-yellow-700">
        <Card sx={{ width: 11 / 12 }}>
            {/* modal start */}
            {menu && (
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
                            onClick={() => addItemToCartHandler(menu._id)}
                            className="w-full"
                            variant="contained"
                            size="small"
                        >
                            Add to cart
                        </Button>
                    ) : isRestaurant ? (
                        <Button
                            onClick={handleEditMenuOpen}
                            className="w-full"
                            variant="contained"
                            size="small"
                        >
                            Edit
                        </Button>
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
