import React from 'react';
import { Link } from 'react-router-dom';
import FadeMenu from '../list/FadeMenu';
import { Avatar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RightDrawer from '../drawer/RightDrawer';
import LogoutIcon from '@mui/icons-material/Logout';
import FlatwareIcon from '@mui/icons-material/Flatware';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { ROLES_CONSTANTS } from '../../utils/constants';
import { useAppSelector } from '../../redux/hooks';
import ConfirmationDialogue from '../alert/ConfirmationDialogue';
import { IUser } from '../../types';

export interface IMenuItems {
    to: string;
    value: string;
}

export interface IMenuItems2 {
    name: string;
    icon: React.ReactElement;
    to: string;
}

const NavBar = ({ currentUser, handleLogout }: { currentUser: IUser; handleLogout: () => void }) => {
    const { myProfile } = useAppSelector((store) => store.profileReducer);

    const isAdmin = currentUser && currentUser.role === ROLES_CONSTANTS.ADMIN;
    const isRestaurant = currentUser && currentUser.role === ROLES_CONSTANTS.RESTAURANT;
    const isUser = currentUser && currentUser.role === ROLES_CONSTANTS.USER;

    const menuItemsAdmin: (IMenuItems | boolean)[] = [
        isAdmin && { to: '/admin/users', value: 'Users' },
        isAdmin && { to: '/admin/restaurants', value: 'Restaurants' },
    ].filter(Boolean); // Ensures no false or undefined values

    const menuItems: (Partial<IMenuItems2> | boolean)[] = [
        currentUser &&
            (isUser || isRestaurant) && {
                name: 'profile',
                icon: <Avatar src="/broken-image.jpg" />,
                to: '/profile',
            },
        currentUser &&
            isUser && {
                name: 'Orders',
                icon: <FlatwareIcon />,
                to: '/order/status',
            },
        currentUser && isUser && { name: 'Cart', icon: <ShoppingCartIcon />, to: '/cart' },
        currentUser &&
            (isUser || isRestaurant) && {
                name: 'Home',
                icon: <ShoppingCartIcon />,
                to: '/',
            },
        currentUser &&
            isRestaurant && {
                name: 'Restaurant',
                icon: <MenuBookIcon />,
                to: '/restaurant',
            },
        currentUser &&
            isRestaurant && {
                name: 'Menu',
                icon: <MenuBookIcon />,
                to: '/restaurant/menu',
            },
        currentUser &&
            isRestaurant && {
                name: 'Restaurant orders',
                icon: <MenuBookIcon />,
                to: '/restaurant/orders',
            },
        { name: 'logout', icon: <LogoutIcon /> },
    ];

    const [open, setOpen] = React.useState(false);

    const handleLogoutButton = () => {
        setOpen(true);
    };
    return (
        <div className="md:w-4/5 px-3 md:mx-auto bg-white shadow-lg">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">Restaurant App</h1>
                </Link>
                <ConfirmationDialogue
                    open={open}
                    setOpen={setOpen}
                    title="Do you want to logout"
                    description="Are you sure?"
                    onAgree={handleLogout}
                    closeText="No"
                    okayText="Yes Logout "
                />
                <div className="hidden md:flex gap-10 items-center ">
                    {currentUser && isUser && (
                        <>
                            <Link to={'/'}>Home</Link>
                            <Link to={'/profile'}>Profile</Link>
                            <Link to={'/orders'}>Orders</Link>
                        </>
                    )}

                    {currentUser && isRestaurant && (
                        <>
                            <Link to={'/restaurant'}>Home</Link>
                            <Link to={'/restaurant/menu'}>Menu</Link>
                            <Link to={'/restaurant/details'}>Details</Link>
                            <Link to={'/restaurant/orders'}>Orders</Link>
                        </>
                    )}

                    <Avatar src={`${myProfile?.imageUrl ? myProfile?.imageUrl : '/broken-image.jpg'}`} />
                    <LogoutIcon onClick={handleLogoutButton} style={{ cursor: 'pointer' }} />
                </div>
                {isAdmin && <FadeMenu menuItems={menuItemsAdmin} />}
                {/* Mobile responsiveness */}
                {!isAdmin && (
                    <div className="md:hidden">
                        <RightDrawer onClickFn={handleLogoutButton} menuItems={menuItems} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;
