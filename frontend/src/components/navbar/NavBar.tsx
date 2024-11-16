import React from "react";
import { Link } from "react-router-dom";
import FadeMenu from "../list/FadeMenu";
import { Avatar, Badge, IconButton, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RightDrawer from "../drawer/RightDrawer";
import LogoutIcon from "@mui/icons-material/Logout";
import FlatwareIcon from "@mui/icons-material/Flatware";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { ROLES_CONSTANTS } from "../../utils/constants";

export interface IMenuItems {
    to: string;
    value: string;
}

export interface IMenuItems2 {
    name: string;
    icon: React.ReactElement;
    to: string;
}

const NavBar = ({currentUser}:{currentUser: any}) => {
    const admin = true;

    const menuItemsAdmin: (IMenuItems | boolean)[] = [
        (currentUser.role === ROLES_CONSTANTS.ADMIN) && { to: "/admin/restaurant", value: "Restaurant" },
        (currentUser.role === ROLES_CONSTANTS.ADMIN) && { to: "/admin/menu", value: "Menu" },
        (currentUser.role === ROLES_CONSTANTS.ADMIN) && { to: "/admin/orders", value: "Order" },
    ];

    const menuItems: (Partial<IMenuItems2> | boolean)[] = [
        (currentUser.role === ROLES_CONSTANTS.USER || currentUser.role === ROLES_CONSTANTS.RESTAURANT)&&{
            name: "profile",
            icon: <Avatar src="/broken-image.jpg" />,
            to: "/profile",
        },
        (currentUser.role === ROLES_CONSTANTS.USER)&&{ name: "order", icon: <FlatwareIcon />, to: "/order/status" },
        (currentUser.role === ROLES_CONSTANTS.USER)&&{ name: "cart", icon: <ShoppingCartIcon />, to: "/cart" },
        (currentUser.role === ROLES_CONSTANTS.USER)&&{ name: "menu", icon: <MenuBookIcon />, to: "/menu" },
        { name: "logout", icon: <LogoutIcon /> },
    ];
    return (
        <div className="w-4/5 mx-3 md:mx-auto">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">
                        Restaurant App
                    </h1>
                </Link>
                <div className="hidden md:flex gap-10 items-center ">
                    <Link to={"/"}>Home</Link>
                    <Link to={"/profile"}>Profile</Link>
                    <Link to={"/order/status"}>Order</Link>
                    <IconButton aria-label="cart">
                        <Badge badgeContent={4} color="primary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>

                    <Avatar src="/broken-image.jpg" />
                    <LogoutIcon />
                </div>
                {admin && <FadeMenu menuItems={menuItemsAdmin} />}
                {/* Mobile responsiveness */}
                <Typography className="md:hidden">
                    <RightDrawer menuItems={menuItems} />
                </Typography>
            </div>
        </div>
    );
};

export default NavBar;
