import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ROLES_CONSTANTS } from '../../utils/constants';
import { useAppSelector } from '../../redux/hooks';
import { useConfirmationContext } from '../../context/confirmationContext';
import { IUser } from '../../types';
import { Drawer, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export interface INavItems {
    name: string;
    to: string;
    value: string;
    icon: React.ReactElement;
}

const NavBar = ({ currentUser, handleLogout }: { currentUser: IUser; handleLogout: () => void }) => {
    const { showConfirmation } = useConfirmationContext();
    const { myProfile } = useAppSelector((store) => store.profileReducer);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();

    const isAdmin = currentUser && currentUser.role === ROLES_CONSTANTS.ADMIN;
    const isRestaurant = currentUser && currentUser.role === ROLES_CONSTANTS.RESTAURANT;
    const isUser = currentUser && currentUser.role === ROLES_CONSTANTS.USER;

    const navItems: INavItems[] = [
        // Common
        { name: 'Home', to: '/', value: 'Home', icon: <HomeOutlinedIcon /> },
        // Admin
        isAdmin && { name: 'Users', to: '/admin/users', value: 'Users', icon: <PeopleOutlineOutlinedIcon /> },
        isAdmin && {
            name: 'Restaurants',
            to: '/admin/restaurants',
            value: 'Restaurants',
            icon: <RestaurantOutlinedIcon />,
        },

        // User
        isUser && { name: 'Profile', to: '/profile', value: 'Profile', icon: <AccountCircleOutlinedIcon /> },
        isUser && { name: 'Orders', to: '/orders', value: 'Orders', icon: <LocalMallOutlinedIcon /> },
        // Restaurant
        isRestaurant && {
            name: 'Restaurant',
            to: '/restaurant/details',
            value: 'Restaurant',
            icon: <RestaurantOutlinedIcon />,
        },
        isRestaurant && {
            name: 'Menu',
            to: '/restaurant/menu',
            value: 'Menu',
            icon: <MenuBookOutlinedIcon />,
        },
        isRestaurant && {
            name: 'Restaurant Orders',
            to: '/restaurant/orders',
            value: 'Restaurant Orders',
            icon: <HomeOutlinedIcon />,
        },
    ].filter(Boolean) as INavItems[]; // Cast to INavItems[] after filtering out false values

    const handleLogoutButton = () => {
        showConfirmation({
            title: 'Do you want to logout',
            description: 'Are you sure?',
            onAgree: handleLogout,
            closeText: 'No',
            okayText: 'Yes logout',
        });
    };

    // Active link
    const isActiveLink = (path: string) =>
        location.pathname === path ? 'font-bold border-b-2 pb-2 border-orange-600' : 'text-gray-600';

    return (
        <div className="md:max-w-7xl px-3 md:mx-auto bg-white shadow-lg">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">Restaurant App</h1>
                </Link>
                {/* Desktop Menu */}
                <div className="hidden md:flex gap-10 items-center ">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-2 ${isActiveLink(item.to)}`}
                        >
                            <span>{item.value}</span>
                        </Link>
                    ))}

                    <Avatar src={`${myProfile?.imageUrl ? myProfile?.imageUrl : '/broken-image.jpg'}`} />
                    <LogoutIcon onClick={handleLogoutButton} style={{ cursor: 'pointer' }} />
                </div>
                {/* Mobile Menu */}
                <div className="md:hidden">
                    <IconButton onClick={() => setIsDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                </div>
                <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                    <div className="flex flex-col gap-10 p-4 h-screen min-w-[250px]">
                        {/* Top */}
                        <div className="flex  justify-between items-center">
                            <h2 className="font-bold text-xl">Select</h2>
                            <IconButton onClick={() => setIsDrawerOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className='flex flex-col justify-between h-full'>
                            {/* Middle */}
                            <div className="flex flex-col justify-between gap-8 mt-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`flex items-center gap-2 text-gray-800 ${isActiveLink(item.to)}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        {item.icon && item.icon}
                                        <span>{item.value}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Bottom */}
                            <div className="flex justify-between pr-5">
                                <div className="flex items-center gap-2 mt-4">
                                    <Avatar
                                        src={`${myProfile?.imageUrl ? myProfile?.imageUrl : '/broken-image.jpg'}`}
                                    />
                                    <span>{(myProfile?.userId as IUser).name || 'Profile'}</span>
                                </div>
                                <div
                                    className="flex items-center gap-2 mt-4 cursor-pointer text-red-500"
                                    onClick={handleLogoutButton}
                                >
                                    {/* <Tooltip title='asdf'> */}

                                    <LogoutIcon />
                                    {/* </Tooltip> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};

export default NavBar;
