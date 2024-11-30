import { useEffect, useState } from 'react';
import AddMenuModal from '../../components/modal/AddMenuModal';
import { Button, Typography } from '@mui/material';
import MenuCard from '../../components/cards/MenuCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMenus } from '../../redux/thunk/menusThunk';
import { IMenu, IRestaurantResponse } from '../../types';

const Menu = () => {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const handleAddMenuOpen = () => setIsAddMenuOpen(true);
    const handleAddMenuClose = () => setIsAddMenuOpen(false);
    const dispatch = useAppDispatch();

    const restaurantData: IRestaurantResponse | null = useAppSelector(
        (state) => state.restaurantReducer.restaurantData
    );
    const menus = useAppSelector((state) => state.menusReducer.menusData);

    useEffect(() => {
        if (restaurantData?.restaurant._id) {
            console.log(' ===== ', restaurantData, ' ===== ');

            dispatch(fetchMenus({ restaurantId: restaurantData.restaurant._id }));
        }
    }, [dispatch, restaurantData]);

    return (
        <div className="my-5">
            <div className="flex justify-between items-center">
                <Typography className="text-xl font-extrabold">Available menus</Typography>
                <div className="mt-3 flex flex-col items-end gap-5">
                    <Button
                        className="h-10"
                        color="warning"
                        variant="contained"
                        onClick={handleAddMenuOpen}
                    >
                        Add menu
                    </Button>
                </div>
                {isAddMenuOpen && (
                    <AddMenuModal isOpen={isAddMenuOpen} handleClose={handleAddMenuClose} />
                )}
            </div>
            {menus && menus.length && (
                <div className="flex flex-wrap justify-center gap-5 mx-5 bg-green-300">
                    {menus.map((menu: IMenu) => (
                        <MenuCard key={menu._id} menu={menu} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;
