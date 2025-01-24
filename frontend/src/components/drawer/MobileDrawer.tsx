import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../../redux/hooks';
import { IUser } from '../../types';
import { isActiveLink } from '../../utils';

type Anchor = 'right';

interface INavItems {
    name: string;
    to: string;
    icon: React.ReactNode;
    value: string;
}

interface IDrawerProps {
    anchor: Anchor;
    handleLogoutButton: () => void;
    navItems: INavItems[];
}

const MobileDrawer: React.FC<IDrawerProps> = ({ anchor, handleLogoutButton, navItems }) => {
    const { myProfile } = useAppSelector((store) => store.profileReducer);
    const location = useLocation();
    const [state, setState] = React.useState({
        right: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setState({ ...state, [anchor]: open });
        };

    const list = (anchor: Anchor) => (
        <Box
            sx={{
                width: 250,
                bgcolor: '#f5f5f5',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box>
                {/* Top */}
                <div className="flex justify-between items-center px-4 py-3">
                    <h2 className="font-bold text-xl">Select</h2>
                    <IconButton className="hover:cursor-pointer">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Divider />
                {/* Middle */}
                <List>
                    {navItems.map(({ icon, name, to, value }) => (
                        <ListItem key={name} disablePadding>
                            <Link
                                to={to}
                                className={`flex w-full items-center gap-2 text-gray-800 ${isActiveLink(location, to)}`}
                            >
                                <ListItemButton
                                    sx={{
                                        width: '100%',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                        },
                                    }}
                                >
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText className="hover:text-orange-700" primary={value} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Box>
            {/* Bottom */}
            <Box>
                <Divider />
                {/* Logout Button */}
                <div className="flex justify-between pb-4 px-4">
                    <div className="flex items-center gap-2 mt-4">
                        <Avatar src={`${myProfile?.imageUrl ? myProfile?.imageUrl : '/broken-image.jpg'}`} />
                        <span>{(myProfile?.userId as IUser)?.name || 'Profile'}</span>
                    </div>
                    <div
                        className="flex items-center gap-2 mt-4 cursor-pointer text-red-500"
                        onClick={handleLogoutButton}
                    >
                        <LogoutIcon />
                    </div>
                </div>
            </Box>
        </Box>
    );

    return (
        <div>
            {([anchor] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button color="warning" onClick={toggleDrawer(anchor, true)}>
                        <MenuIcon />
                    </Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        sx={{
                            '& .MuiDrawer-paper': {
                                transition: 'transform 0.3s ease-in-out',
                            },
                        }}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
};

export default MobileDrawer;
