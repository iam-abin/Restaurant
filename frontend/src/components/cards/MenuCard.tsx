import FriedChicken from '../../assets/fried-chicken-french-fries-black-cement-floor (1).jpg'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import EditMenuModal from '../modal/EditMenuModal'
import { IMenu } from '../../types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { ROLES_CONSTANTS } from '../../utils/constants'
import { addToCartApi } from '../../api/apiMethods/cart'
import { hotToastMessage } from '../../utils/hotToast'
import { addToCart } from '../../redux/thunk/cartThunk'

const MenuCard = ({ menu }: { menu: IMenu }) => {
    const authData = useAppSelector((store) => store.authReducer.authData)
    const isAdmin = authData.role === ROLES_CONSTANTS.ADMIN
    const isUser = authData.role === ROLES_CONSTANTS.USER
    const isRestaurant = authData.role === ROLES_CONSTANTS.RESTAURANT

    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false)
    const handleEditMenuOpen = () => setIsEditMenuOpen(true)
    const handleEditMenuClose = () => setIsEditMenuOpen(false)
    const dispatch = useAppDispatch()

    const addItemToCartHandler = async (menuItemId: string) => {
        console.log(menuItemId);
        
        dispatch(addToCart(menuItemId))
    }

    return (
        <div className="flex justify-center bg-yellow-700">
            <Card sx={{ width: 10 / 12 }}>
                <div className="flex md:flex">
                    {menu && (
                        <EditMenuModal
                            menu={menu}
                            isOpen={isEditMenuOpen}
                            handleClose={handleEditMenuClose}
                        />
                    )}
                    <div className="relative">
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            className="w-40 h-40  object-cover"
                            image={menu.imageUrl}
                        />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
                        </Typography>

                        <p>{menu.description}</p>
                        <h2 className="text-lg font-semibold mt-4">
                            Price:{' '}
                            <Typography className="text-yellow-600">₹{menu.price}</Typography>
                        </h2>
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
            </Card>
        </div>
    )
}

export default MenuCard
