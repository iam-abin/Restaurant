import { useEffect, useState } from 'react';
import { RestaurantMenu } from '@mui/icons-material'; // MUI Icon
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMenus } from '../../redux/thunk/menusThunk';
import { IMenu, IRestaurantResponse } from '../../types';
import MenuModal from '../../components/modal/MenuModal';
import MenuCard from '../../components/cards/MenuCard';
import usePagination from '../../hooks/usePagination';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import CustomButton from '../../components/Button/CustomButton';
import { ITEMS_PER_PAGE } from '../../constants';

const Menu: React.FC = () => {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const handleAddMenuOpen = () => setIsAddMenuOpen(true);
    const handleAddMenuClose = () => setIsAddMenuOpen(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    const restaurantData: IRestaurantResponse | null = useAppSelector(
        (state) => state.restaurantReducer.restaurantData,
    );
    const menus = useAppSelector((state) => state.menusReducer.menusData);

    useEffect(() => {
        if (restaurantData?.restaurant._id) {
            handleMenusDispatch(restaurantData.restaurant._id);
        }
    }, [dispatch, restaurantData, currentPage]);

    const handleMenusDispatch = (restaurantId: string): void => {
        dispatch(
            fetchMenus({
                restaurantId,
                setTotalNumberOfPages,
                currentPage,
                limit: ITEMS_PER_PAGE,
            }),
        );
    };
    return (
        <div className="my-5">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Available menu</h1>
                <div className="mt-3 flex flex-col items-end gap-5">
                    <CustomButton onClick={handleAddMenuOpen}>Add menu</CustomButton>
                </div>
                {isAddMenuOpen && (
                    <MenuModal
                        isOpen={isAddMenuOpen}
                        handleMenusDispatch={handleMenusDispatch}
                        handleClose={handleAddMenuClose}
                    />
                )}
            </div>
            {menus && menus.length > 0 ? (
                <div className=" flex flex-col gap-2 items-center my-4">
                    {/* <div className="flex flex-wrap justify-center gap-5 mx-5 bg-green-300"> */}
                    {menus.map((menu: IMenu) => (
                        <MenuCard key={menu._id} menu={menu} />
                    ))}
                    <div className="flex justify-center my-10">
                        <PaginationButtons
                            handlePageChange={handlePageChange}
                            numberOfPages={totalNumberOfPages}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className="flex flex-col items-center p-6 bg-white rounded shadow-lg">
                        <RestaurantMenu className="text-red-500" style={{ fontSize: 80 }} />
                        <h1 className="mt-4 text-2xl font-semibold text-gray-800">Menu Not Available</h1>
                        <p className="mt-2 text-gray-600">
                            Sorry, the menu you&apos;re looking for is currently unavailable.
                        </p>
                        <CustomButton onClick={() => navigate('/')}>Back to Home</CustomButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
