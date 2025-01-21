import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Chip, IconButton, Typography } from '@mui/material';
import { ShoppingCart, TimerOutlined } from '@mui/icons-material';

import { ICuisineResponse1, IMenu, IRestaurantResponse2, IRestaurantResult } from '../../types';
import { changeRatingApi, getARestaurantApi } from '../../api/apiMethods';

import MenuCardSkeleton from '../../components/shimmer/MenuCardSkeleton';
import MenuCard from '../../components/cards/MenuCard';
import StarRating from '../../components/rating/StarRating';
import RatingModal from '../../components/modal/RatingModal';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addToCart } from '../../redux/thunk/cartThunk';
import { hotToastMessage } from '../../utils';
import { fetchMenus } from '../../redux/thunk/menusThunk';
import usePagination from '../../hooks/usePagination';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import { ITEMS_PER_PAGE } from '../../constants';

const RestaurantDetails: React.FC = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const [restaurant, setRestaurant] = useState<IRestaurantResponse2 | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});
    const menus = useAppSelector((state) => state.menusReducer.menusData);

    const { restaurantId } = params;
    const [myRatingValue, setMyRatingValue] = useState<number>(0);
    const [cartItemsCount, setCartItemsCount] = useState<number>(0);
    const [restaurantRatingValue, setRestaurantRatingValue] = useState<number>(0);
    const [restaurantRatingCount, setRestaurantRatingCount] = useState<number>(0);
    const [cuisines, setCuisines] = useState<
        {
            cuisineId: ICuisineResponse1;
        }[]
    >([]);

    const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
    const handleOpenModal = (): void => setIsRatingModalOpen(true);

    const handleCloseModal = (): void => setIsRatingModalOpen(false);

    const handleRatingChange = async (
        _event: React.SyntheticEvent<Element, Event>,
        value: number | null,
    ): Promise<void> => {
        setMyRatingValue(value ?? 0);
        if (restaurant) {
            await changeRatingApi({ restaurantId: restaurant._id!, rating: value ?? 0 });
        }
    };

    const addItemToCartHandler = async (menuItemId: string): Promise<void> => {
        const response = await dispatch(
            addToCart({ itemId: menuItemId, restaurantId: params.restaurantId! }),
        );
        if (response.meta.requestStatus === 'rejected') {
            hotToastMessage(response.payload as string, 'error');
            return;
        }
        setCartItemsCount((cartItemCount: number) => cartItemCount + 1);
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const response = await getARestaurantApi(restaurantId!);
            setRestaurant((response.data as IRestaurantResult).restaurant as IRestaurantResponse2);
            setCuisines((response.data as IRestaurantResult).restaurantCuisines);
            setRestaurantRatingValue((response.data as IRestaurantResult).restaurantRating);
            setRestaurantRatingCount((response.data as IRestaurantResult).restaurantRatingsCount);
            setMyRatingValue((response.data as IRestaurantResult).myRating);
            setCartItemsCount((response.data as IRestaurantResult).cartItemsCount);
            setIsLoading(false);
        })();
    }, [myRatingValue]);

    useEffect(() => {
        if (restaurantId) {
            handleMenusDispatch(restaurantId);
        }
    }, [dispatch, restaurant, currentPage]);

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
        <div className="max-w-6xl mx-auto my-10">
            <div className="w-full">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img
                        src={restaurant?.imageUrl || 'Loading...'}
                        alt="res_image"
                        className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5 w-full">
                        <span className="font-extrabold text-2xl">{restaurant?.ownerId?.name}</span>
                        <div className="flex my-2 items-center justify-between">
                            <div className="flex flex-row gap-1 max-w-full">
                                {cuisines?.map((cuisine: { cuisineId: ICuisineResponse1 }, index: number) => {
                                    return (
                                        <div key={index}>
                                            <Chip label={cuisine.cuisineId.name} variant="filled" />
                                        </div>
                                    );
                                })}
                            </div>
                            <IconButton aria-label="cart  ">
                                <Badge badgeContent={cartItemsCount} color="primary">
                                    <Link to={`/cart/${restaurantId}`}>
                                        <ShoppingCart />
                                    </Link>
                                </Badge>
                            </IconButton>
                        </div>

                        <div className="flex md:flex-row flex-col gap-2 my-5">
                            <div className="flex items-center gap-2">
                                <TimerOutlined className="w-5 h-5" />
                                <h1 className="flex items-center gap-2 font-medium">
                                    Delivery Time:{' '}
                                    <Typography className="text-[#D19254]">
                                        {restaurant?.deliveryTime} mins
                                    </Typography>
                                </h1>
                            </div>
                        </div>
                        <div className="flex ">
                            <StarRating ratingValue={restaurantRatingValue} isReadOnly={true} />{' '}
                            <span>
                                ( {restaurantRatingCount} ){' '}
                                <span
                                    className="font-medium text-gray-600 hover:cursor-pointer hover:text-sky-700"
                                    onClick={handleOpenModal}
                                >
                                    Rate this restaurant
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="md:p-4">
                    <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
                    <div className="flex flex-col gap-2 items-center my-4">
                        {isLoading ? (
                            <>
                                <MenuCardSkeleton />
                                <MenuCardSkeleton />
                                <MenuCardSkeleton />
                            </>
                        ) : menus && menus.length > 0 ? (
                            menus
                                .filter(
                                    (menu): menu is IMenu =>
                                        menu &&
                                        '_id' in menu &&
                                        'name' in menu &&
                                        'price' in menu &&
                                        'description' in menu,
                                )
                                .map((menu) => (
                                    <MenuCard
                                        key={menu._id}
                                        menu={menu}
                                        addItemToCartHandler={addItemToCartHandler}
                                    />
                                ))
                        ) : (
                            'No menus available'
                        )}
                    </div>

                    <div className="flex justify-center my-10">
                        <PaginationButtons
                            handlePageChange={handlePageChange}
                            numberOfPages={totalNumberOfPages}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </div>
            {/* Rating modal */}
            <RatingModal
                handleRatingChange={handleRatingChange}
                isModalOpen={isRatingModalOpen}
                myRating={myRatingValue}
                closeRatingModal={handleCloseModal}
            />
        </div>
    );
};

export default RestaurantDetails;
