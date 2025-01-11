import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppSelector } from '../../redux/hooks';
import { useConfirmationContext } from '../../context/confirmationContext';
import { IUser, UserRole } from '../../types';
import { IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { checkRole, isActiveLink } from '../../utils';
import MobileDrawer from '../drawer/MobileDrawer';
import { INavItems } from '../../types/navbar';

interface INavBarProps {
    currentUser: IUser;
    handleLogout: () => void;
}

const NavBar: React.FC<INavBarProps> = ({ currentUser, handleLogout }) => {
    const { showConfirmation } = useConfirmationContext();
    const { myProfile } = useAppSelector((store) => store.profileReducer);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const location = useLocation();

    const isAdmin: boolean = checkRole(UserRole.ADMIN, currentUser?.role);
    const isRestaurant: boolean = checkRole(UserRole.RESTAURANT, currentUser?.role);
    const isUser: boolean = checkRole(UserRole.USER, currentUser?.role);

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
            name: 'Orders',
            to: '/restaurant/orders',
            value: 'Orders',
            icon: <HomeOutlinedIcon />,
        },
    ].filter(Boolean) as INavItems[]; // Cast to INavItems[] after filtering out false values

    const handleLogoutButton = (): void => {
        showConfirmation({
            title: 'Do you want to logout',
            description: 'Are you sure?',
            onAgree: handleLogout,
            closeText: 'No',
            okayText: 'Yes logout',
        });
    };

    return (
        <div className="md:max-w-7xl px-3 md:mx-auto bg-white shadow-lg">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">Restaurant</h1>
                </Link>
                {/* Desktop Menu */}
                <div className="hidden md:flex gap-10 items-center ">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-2 ${isActiveLink(location, item.to)}`}
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
                <MobileDrawer
                    anchor="right"
                    navItems={navItems}
                    isDrawerOpen={isDrawerOpen}
                    handleCloseDrawer={() => setIsDrawerOpen(false)}
                    handleLogoutButton={handleLogoutButton}
                />
            </div>
        </div>
    );
};

export default NavBar;
