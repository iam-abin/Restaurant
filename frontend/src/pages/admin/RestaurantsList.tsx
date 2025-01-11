import { useEffect, useState } from 'react';
import { IRestaurant, IRestaurantsResponse, IUser } from '../../types';
import { IResponse } from '../../types/api';
import SearchBar from '../../components/search/SearchBar';
import Table from '../../components/table/Table';
import { hotToastMessage } from '../../utils/hotToast';
import { blockUnblockUserApi } from '../../api/apiMethods/auth';
import { getRestaurantsApi } from '../../api/apiMethods/restaurant';
import { useConfirmationContext } from '../../context/confirmationContext';
import { Button, Chip } from '@mui/material';

const RestaurantsList: React.FC = () => {
    const [restaurantsData, setRestaurantsData] = useState<IRestaurant[]>([]);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const { showConfirmation } = useConfirmationContext();
    const currentPage: number = 1;

    const [searchKey, setSearchKey] = useState('');

    const USERS_PER_PAGE: number = 2;

    const fetchUsers = async (currentPage: number): Promise<void> => {
        let restaurantsData: IResponse | [] = [];
        // if (!searchKey) {
        restaurantsData = await getRestaurantsApi(currentPage, USERS_PER_PAGE);
        const data = restaurantsData?.data as IRestaurantsResponse;
        setRestaurantsData(data.restaurants as IRestaurant[]);

        setNumberOfPages(data.numberOfPages);
    };

    useEffect(() => {
        fetchUsers(1); // Fetch initial data for the first page
    }, [searchKey, currentPage]);

    const handleBlockUnblockButton = (userId: string, isBlocked: boolean): void => {
        showConfirmation({
            title: `Do you want to ${isBlocked ? 'unblock' : 'block'} this restaurant`,
            description: 'Are you sure?',
            onAgree: () => handleBlockUnblock(userId),
            closeText: 'No',
            okayText: `Yes ${isBlocked ? 'unblock' : 'block'}`,
        });
    };

    const handleBlockUnblock = async (userId: string): Promise<void> => {
        const updatedUser: IResponse | null = await blockUnblockUserApi(userId);

        if (updatedUser) {
            hotToastMessage(updatedUser.message, 'success');

            const restaurants: IRestaurant[] = restaurantsData.map((restaurant: IRestaurant) => {
                if (restaurant.ownerId._id === userId) {
                    return {
                        ...restaurant,
                        ownerId: {
                            ...restaurant.ownerId,
                            isBlocked: (updatedUser?.data as IUser).isBlocked,
                        },
                    };
                }

                return restaurant;
            });

            setRestaurantsData(restaurants);
        }
    };

    const columns = [
        { Header: 'Name', accessor: 'ownerId.name' },
        { Header: 'Email', accessor: 'ownerId.email' },
        { Header: 'Phone', accessor: 'ownerId.phone' },
        {
            Header: 'Profile Image',
            button: (row: { imageUrl: string }) => (
                <img src={row.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ),
        },
        {
            Header: 'Status',
            button: (row: { ownerId?: { isBlocked: boolean } }) => (
                <Chip
                    label={row?.ownerId?.isBlocked ? 'inActive' : 'active'}
                    color={row?.ownerId?.isBlocked ? 'error' : 'success'}
                    variant="filled"
                />
            ),
        },
        {
            Header: 'Action',
            button: (row: { ownerId: { _id: string; isBlocked: boolean } }) => (
                <Button
                    color={row.ownerId.isBlocked ? 'success' : 'error'}
                    onClick={() => {
                        handleBlockUnblockButton(row.ownerId._id, row.ownerId.isBlocked);
                    }}
                    variant="contained"
                >
                    {row.ownerId.isBlocked ? 'Unblock' : 'Block'}
                </Button>
            ),
        },
    ];

    return (
        <div className="text-center mx-10">
            <h1 className="font-semibold text-5xl mt-4 mb-10">Restaurants Management</h1>
            <div className="flex flex-row justify-end my-2">
                <SearchBar placeholder={'search with name'} onSearch={setSearchKey} />
            </div>
            <Table
                columns={columns}
                data={restaurantsData}
                numberOfPages={numberOfPages}
                fetchData={fetchUsers}
            />
        </div>
    );
};

export default RestaurantsList;
