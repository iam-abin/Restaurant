import { Link, useLocation } from 'react-router-dom';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { useAppSelector } from '../../redux/hooks';
import { isActiveLink } from '../../utils';
import { IUser } from '../../types';
import { INavItems } from '../../types/navbar';

interface IDrawerProps {
    anchor: 'right' | 'left';
    isDrawerOpen: boolean;
    handleCloseDrawer: () => void;
    handleLogoutButton: () => void;
    navItems: INavItems[];
}

const MobileDrawer: React.FC<IDrawerProps> = ({
    anchor,
    isDrawerOpen,
    handleCloseDrawer,
    handleLogoutButton,
    navItems,
}) => {
    const location = useLocation();
    const { myProfile } = useAppSelector((store) => store.profileReducer);

    return (
        <Drawer anchor={anchor} open={isDrawerOpen} onClose={handleCloseDrawer}>
            <div className="flex flex-col gap-10 p-4 h-screen min-w-[250px]">
                {/* Top */}
                <div className="flex  justify-between items-center">
                    <h2 className="font-bold text-xl">Select</h2>
                    <IconButton onClick={handleCloseDrawer}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="flex flex-col justify-between h-full">
                    {/* Middle */}
                    <div className="flex flex-col justify-between gap-8 mt-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex bg-yellow-200 items-center gap-2 text-gray-800 ${isActiveLink(location, item.to)}`}
                                onClick={handleCloseDrawer}
                            >
                                {item?.icon}
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
                            <span>{(myProfile?.userId as IUser)?.name || 'Profile'}</span>
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
    );
};

export default MobileDrawer;
