import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { Link } from "react-router-dom";
import { IMenuItems } from "../navbar/NavBar";

const FadeMenu: React.FC<{ menuItems: (IMenuItems | boolean)[] }> = ({
    menuItems,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                Dashboard
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                {menuItems.map((item: any) => (
                    <Link to={item.to}>
                        <MenuItem key={item.value} onClick={handleClose}>
                            {item.value}
                        </MenuItem>
                    </Link>
                ))}
            </Menu>
        </div>
    );
};

export default FadeMenu