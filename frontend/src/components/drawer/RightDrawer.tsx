import { useState, KeyboardEvent, MouseEvent, Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { IMenuItems2 } from "../navbar/NavBar";
import { Link } from "react-router-dom";

type Anchor = "right";

export default function RightDrawer({
    menuItems,
}: {
    menuItems: (Partial<IMenuItems2> | boolean)[];
}) {
    const [state, setState] = useState({ right: false });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
        (event: KeyboardEvent | MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as KeyboardEvent).key === "Tab" ||
                    (event as KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setState({ ...state, [anchor]: open });
        };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List className="flex flex-col gap-8">
                {menuItems
                    .filter(
                        (
                            item: boolean | Partial<IMenuItems2>
                        ): item is Partial<IMenuItems2> =>
                            typeof item === "object" && item !== null
                    )
                    .map((item) => (
                        <ListItem key={item.name} disablePadding>
                            <ListItemButton className="flex gap-4">
                                {item.icon}
                                {item.to ? (
                                    <Link to={item.to}>{item.name}</Link>
                                ) : (
                                    item.name
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
            <Divider />
        </Box>
    );

    return (
        <div>
            {(["right"] as const).map((anchor) => (
                <Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>
                        <LunchDiningIcon />
                    </Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </Fragment>
            ))}
        </div>
    );
}
