import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';
import { IMenuItems } from '../navbar/NavBar';

const FadeMenu: React.FC<{ menuItems: (IMenuItems | boolean)[] }> = ({ menuItems }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Type guard to filter valid IMenuItems
    const isValidMenuItem = (item: IMenuItems | boolean): item is IMenuItems =>
        typeof item === 'object' && item !== null && 'to' in item && 'value' in item;

    const validMenuItems = menuItems.filter(isValidMenuItem);

    return (
        <div>
            <Button
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                Dashboard
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {validMenuItems.map((item) => (
                    <Link key={item.to} to={item.to}>
                        <MenuItem onClick={handleClose}>{item.value}</MenuItem>
                    </Link>
                ))}
            </Menu>
        </div>
    );
};

export default FadeMenu;
