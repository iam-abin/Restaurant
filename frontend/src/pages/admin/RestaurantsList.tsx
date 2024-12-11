import { useEffect, useState } from 'react';
import { IRestaurant, IRestaurantsResponse, IUser } from '../../types';
import { IResponse } from '../../types/api';
import SearchBar from '../../components/search/SearchBar';
import Table from '../../components/table/Table';
import { hotToastMessage } from '../../utils/hotToast';
import { blockUnblockUserApi } from '../../api/apiMethods/auth';
import { getRestaurantsApi } from '../../api/apiMethods/restaurant';

function RestaurantsList() {
    const [restaurantsData, setRestaurantsData] = useState<IRestaurant[]>([]);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);


    const [searchKey, setSearchKey] = useState('');

    const USERS_PER_PAGE: number = 2;

    const fetchUsers = async (currentPage: number) => {
        let restaurantsData: IResponse | [] = [];
        // if (!searchKey) {
        console.log('no search key');
        restaurantsData = await getRestaurantsApi(currentPage, USERS_PER_PAGE);
        const data = restaurantsData?.data as IRestaurantsResponse
        setRestaurantsData( data.restaurants as IRestaurant[]);
        setNumberOfPages( data.numberOfPages)
    };

    useEffect(() => {
        fetchUsers(1); // Fetch initial data for the first page
    }, [searchKey, currentPage]);

    const handleBlockUnblock = async (userId: string) => {
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
                       }
                    };
                }

                return restaurant;
            });

            setRestaurantsData(restaurants);
        }
    };

    console.log(restaurantsData);

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
                <div
                    className={`badge ${
                        row?.ownerId?.isBlocked
                            ? 'badge badge-success gap-2 w-20'
                            : 'badge badge-error gap-2 w-20'
                    } `}
                >
                    {row?.ownerId?.isBlocked ? 'inActive' : 'active'}
                </div>
            ),
        },
        {
            Header: 'Action',
            button: (row: {ownerId:{ _id: string; isBlocked: boolean }}) => (
                <button
                    onClick={() => {
                        handleBlockUnblock(row.ownerId._id);
                    }}
                    className={`btn ${
                        row.ownerId.isBlocked
                            ? 'btn-success btn-sm w-24 bg-green-600'
                            : 'btn btn-error btn-sm w-24 bg-red-600'
                    } `}
                >
                    {row.ownerId.isBlocked ? 'Unblock' : 'Block'}
                </button>
            ),
        },
    ];

    return (
        <div className="text-center mx-10">
            <h1 className="font-semibold text-5xl mt-4 mb-10">Restaurants Management</h1>
            <div className="flex flex-row justify-end my-2">
                <SearchBar placeholder={'search with name'} onSearch={setSearchKey} />
            </div>
            <Table columns={columns} data={restaurantsData} numberOfPages={numberOfPages} fetchData={fetchUsers} />
            {/* <ConfirmationDialogue
                    open={open}
                    setOpen={setOpen}
                    title={`Do you want to ${isBlocked ? "block" : "unblock"} this user?`}
                    description="Are you sure?"
                    onAgree={handleBlockUnblock(userId, isBlocked)}
                    closeText='No'
                    okayText={isBlocked ? "active" : "inActive"}
                /> */}
        </div>
    );
}

export default RestaurantsList;
