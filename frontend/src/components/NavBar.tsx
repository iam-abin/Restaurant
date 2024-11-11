import React from "react";
import { Link } from "react-router-dom";
import FadeMenu from "./FadeMenu";
import { Avatar, Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RightDrawer from "./RightDrawer";
import LogoutIcon from "@mui/icons-material/Logout";
import FlatwareIcon from "@mui/icons-material/Flatware";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export interface IMenuItems {
    to: string;
    value: string;
}

export interface IMenuItems2 {
    name: string;
    icon: React.ReactElement;
    to: string;
}

const NavBar = () => {
    const admin = false;
    const menuItemsAdmin: IMenuItems[] = [
        { to: "/admin/restaurant", value: "Restaurant" },
        { to: "/admin/menu", value: "Menu" },
        { to: "/admin/order", value: "Order" },
    ];

    const menuItems: Partial<IMenuItems2>[] = [
        {
            name: "profile",
            icon: <Avatar src="/broken-image.jpg" />,
            to: "/profile",
        },
        { name: "order", icon: <FlatwareIcon />, to: "/order/status" },
        { name: "cart", icon: <ShoppingCartIcon />, to: "/cart" },
        { name: "menu", icon: <MenuBookIcon />, to: "/menu" },
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
                <span className="md:hidden">
                    <RightDrawer menuItems={menuItems} />
                </span>
            </div>
        </div>
    );
};

export default NavBar;
