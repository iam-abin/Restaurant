import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import FadeMenu from '../list/FadeMenu'
import { Avatar, Badge, IconButton, Typography } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import RightDrawer from '../drawer/RightDrawer'
import LogoutIcon from '@mui/icons-material/Logout'
import FlatwareIcon from '@mui/icons-material/Flatware'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { ROLES_CONSTANTS } from '../../utils/constants'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchCartItems } from '../../redux/thunk/cartThunk'

export interface IMenuItems {
    to: string
    value: string
}

export interface IMenuItems2 {
    name: string
    icon: React.ReactElement
    to: string
}

const NavBar = ({ currentUser, handleLogout }: { currentUser: any; handleLogout: () => void }) => {
    const { myProfile } = useAppSelector((store) => store.profileReducer)
    const { cartData } = useAppSelector((store) => store.cartReducer)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchCartItems())
    }, [])

    const isAdmin = currentUser && currentUser.role === ROLES_CONSTANTS.ADMIN
    const isRestaurant = currentUser && currentUser.role === ROLES_CONSTANTS.RESTAURANT
    const isUser = currentUser && currentUser.role === ROLES_CONSTANTS.USER

    const menuItemsAdmin: (IMenuItems | boolean)[] = [
        isAdmin && { to: '/admin/restaurant', value: 'Restaurant' },
        isAdmin && { to: '/admin/menu', value: 'Menu' },
        isAdmin && { to: '/admin/orders', value: 'Order' }
    ].filter(Boolean) // Ensures no false or undefined values

    const menuItems: (Partial<IMenuItems2> | boolean)[] = [
        currentUser &&
            (isUser || isRestaurant) && {
                name: 'profile',
                icon: <Avatar src="/broken-image.jpg" />,
                to: '/profile'
            },
        currentUser &&
            isUser && {
                name: 'Orders',
                icon: <FlatwareIcon />,
                to: '/order/status'
            },
        currentUser && isUser && { name: 'Cart', icon: <ShoppingCartIcon />, to: '/cart' },
        currentUser &&
            (isUser || isRestaurant) && {
                name: 'Home',
                icon: <ShoppingCartIcon />,
                to: '/'
            },
        currentUser &&
            isRestaurant && {
                name: 'Restaurant',
                icon: <MenuBookIcon />,
                to: '/restaurant'
            },
        currentUser &&
            isRestaurant && {
                name: 'Menu',
                icon: <MenuBookIcon />,
                to: '/restaurant/menu'
            },
        currentUser &&
            isRestaurant && {
                name: 'Restaurant orders',
                icon: <MenuBookIcon />,
                to: '/restaurant/orders'
            },
        { name: 'logout', icon: <LogoutIcon /> }
    ]
    return (
        <div className="w-4/5 mx-3 md:mx-auto">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">Restaurant App</h1>
                </Link>
                <div className="hidden md:flex gap-10 items-center ">
                    {currentUser && isUser && (
                        <>
                            <Link to={'/'}>Home</Link>
                            <Link to={'/profile'}>Profile</Link>
                            <Link to={'/order/status'}>Order</Link>

                            <IconButton aria-label="cart">
                                <Badge badgeContent={cartData.length} color="primary">
                                    <Link to={'/cart'}>
                                        <ShoppingCartIcon />
                                    </Link>
                                </Badge>
                            </IconButton>
                        </>
                    )}

                    <Avatar
                        src={`${myProfile?.imageUrl ? myProfile?.imageUrl : '/broken-image.jpg'}`}
                    />
                    <LogoutIcon onClick={handleLogout} style={{ cursor: 'pointer' }} />
                </div>
                {isAdmin && <FadeMenu menuItems={menuItemsAdmin} />}
                {/* Mobile responsiveness */}
                {!isAdmin && (
                    <div className="md:hidden">
                        <RightDrawer onClickFn={handleLogout} menuItems={menuItems} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar
