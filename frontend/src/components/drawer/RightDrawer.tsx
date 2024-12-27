import { useState, KeyboardEvent, MouseEvent, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Box, Drawer, Button, List, Divider, ListItem, ListItemButton } from '@mui/material';
import { LunchDining } from '@mui/icons-material';

import { IMenuItems2 } from '../navbar/NavBar';

type Anchor = 'right';

export default function RightDrawer({
    onClickFn,
    menuItems,
}: {
    menuItems: (Partial<IMenuItems2> | boolean)[];
    onClickFn: () => void;
}) {
    const [state, setState] = useState({ right: false });

    const handleClick = (item: Partial<IMenuItems2>) => {
        if (item.name === 'logout') {
            onClickFn();
        }
    };
    const toggleDrawer = (anchor: Anchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
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
                        (item: boolean | Partial<IMenuItems2>): item is Partial<IMenuItems2> =>
                            typeof item === 'object' && item !== null,
                    )
                    .map((item) => (
                        <ListItem key={item.name} disablePadding>
                            <ListItemButton onClick={() => handleClick(item)} className="flex gap-4">
                                {item.icon}
                                {item.to ? <Link to={item.to}>{item.name}</Link> : item.name}
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
            <Divider />
        </Box>
    );

    return (
        <div>
            {(['right'] as const).map((anchor) => (
                <Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>
                        <LunchDining />
                    </Button>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        {list(anchor)}
                    </Drawer>
                </Fragment>
            ))}
        </div>
    );
}
