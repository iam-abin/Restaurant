import { useEffect, useState } from 'react';
import AddMenuModal from '../../components/modal/AddMenuModal';
import { Button, Typography } from '@mui/material';
import MenuCard from '../../components/cards/MenuCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMenus } from '../../redux/thunk/menusThunk';
import { IMenu, IRestaurantResponse } from '../../types';

import { RestaurantMenu } from '@mui/icons-material'; // MUI Icon
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const handleAddMenuOpen = () => setIsAddMenuOpen(true);
    const handleAddMenuClose = () => setIsAddMenuOpen(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const restaurantData: IRestaurantResponse | null = useAppSelector(
        (state) => state.restaurantReducer.restaurantData,
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
                <h1 className="text-2xl font-bold">Available menu</h1>
                <div className="mt-3 flex flex-col items-end gap-5">
                    <Button className="h-10" color="warning" variant="contained" onClick={handleAddMenuOpen}>
                        Add menu
                    </Button>
                </div>
                {isAddMenuOpen && <AddMenuModal isOpen={isAddMenuOpen} handleClose={handleAddMenuClose} />}
            </div>
            {menus && menus.length > 0 ? (
                <div className=" flex flex-col gap-2 items-center my-4">
                {/* <div className="flex flex-wrap justify-center gap-5 mx-5 bg-green-300"> */}
                    {menus.map((menu: IMenu) => (
                        <MenuCard key={menu._id} menu={menu} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className="flex flex-col items-center p-6 bg-white rounded shadow-lg">
                        <RestaurantMenu className="text-red-500" style={{ fontSize: 80 }} />
                        <h1 className="mt-4 text-2xl font-semibold text-gray-800">Menu Not Available</h1>
                        <p className="mt-2 text-gray-600">
                            Sorry, the menu you're looking for is currently unavailable.
                        </p>
                        <button
                            className="mt-6 px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                            onClick={() => (navigate('/'))}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
