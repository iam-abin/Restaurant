import { Link, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useConfirmationContext } from '../../context/confirmationContext';
import { IUser, UserRole } from '../../types';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { checkRole, isActiveLink } from '../../utils';
import MobileDrawer from '../drawer/MobileDrawer';
import { INavItems } from '../../types/navbar';
import { clearProfile } from '../../redux/slice/profileSlice';
import { clearMenus } from '../../redux/slice/menusSlice';
import { clearCart } from '../../redux/slice/cartSlice';
import { clearRestaurant } from '../../redux/slice/restaurantSlice';
import { clearOtpTokenTimer } from '../../redux/slice/otpTokenSlice';
import { clearAdminDashboard } from '../../redux/slice/dashboardSlice';
import { logoutUser } from '../../redux/thunk/authThunk';

interface INavBarProps {
    currentUser: IUser;
}

const NavBar: React.FC<INavBarProps> = ({ currentUser }) => {
    const { showConfirmation } = useConfirmationContext();
    const { myProfile } = useAppSelector((store) => store.profileReducer);
    const location = useLocation();

    const naivgate: NavigateFunction = useNavigate();
    const dispatch = useAppDispatch();

    const isAdmin: boolean = checkRole(UserRole.ADMIN, currentUser?.role);
    const isRestaurant: boolean = checkRole(UserRole.RESTAURANT, currentUser?.role);
    const isUser: boolean = checkRole(UserRole.USER, currentUser?.role);

    const handleLogout = async (): Promise<void> => {
        const response = await dispatch(logoutUser());
        if (isUser) {
            dispatch(clearProfile());
            dispatch(clearMenus());
            dispatch(clearCart());
        }

        if (isRestaurant) {
            dispatch(clearRestaurant());
            dispatch(clearMenus());
        }

        if (isAdmin) {
            dispatch(clearAdminDashboard());
        }
        dispatch(clearOtpTokenTimer());
        // Check if the action was rejected
        if (response.meta.requestStatus !== 'rejected') {
            naivgate('/auth');
        }
    };

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
                    <MobileDrawer
                        anchor="right"
                        navItems={navItems}
                        handleLogoutButton={handleLogoutButton}
                    />
                </div>
            </div>
        </div>
    );
};

export default NavBar;
