import { useEffect, useState } from 'react';
import { IRestaurant, IUser } from '../../types';
import { IResponse } from '../../types/api';
import SearchBar from '../../components/search/SearchBar';
import Table from '../../components/table/Table';
import { hotToastMessage } from '../../utils/hotToast';
import { blockUnblockUserApi } from '../../api/apiMethods/auth';
import { getRestaurantsApi } from '../../api/apiMethods/restaurant';

function RestaurantsList() {
    const [usersData, setUsersData] = useState<IUser[]>([]);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState('');

    const USERS_PER_PAGE: number = 2;

    const fetchUsers = async (currentPage: number) => {
        let usersData: IResponse | [] = [];
        // if (!searchKey) {
        console.log('no search key');
        usersData = await getRestaurantsApi(currentPage, USERS_PER_PAGE);
        setUsersData(usersData?.data as IUser[]);
    };

    useEffect(() => {
        fetchUsers(1); // Fetch initial data for the first page
    }, [searchKey, currentPage]);

    const handleBlockUnblock = async (userId: string) => {
        const updatedUser: IResponse | null = await blockUnblockUserApi(userId);

        if (updatedUser) {
            hotToastMessage(updatedUser.message, 'success');

            // const users = usersData.map((user) => {
            //     if (user.id === userId) {
            //         return {
            //             ...user,
            //             isBlocked: updatedUser?.data.isBlocked,
            //         };
            //     }

            //     return user;
            // });

            // setUsersData(users);
        }
    };

    console.log(usersData);

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
            button: (row: { ownerId?: { isBlocked: string } }) => (
                <div
                    className={`badge ${
                        row?.ownerId?.isBlocked
                            ? 'badge badge-success gap-2 w-20'
                            : 'badge badge-error gap-2 w-20'
                    } `}
                >
                    {row?.ownerId?.isBlocked ? 'active' : 'inActive'}
                </div>
            ),
        },
        {
            Header: 'Action',
            button: (row: { id: string; isBlocked: boolean }) => (
                <button
                    onClick={() => {
                        handleBlockUnblock(row.id);
                    }}
                    className={`btn ${
                        row.isBlocked
                            ? 'btn-success btn-sm w-24 bg-green-600'
                            : 'btn btn-error btn-sm w-24 bg-red-600'
                    } `}
                >
                    {row.isBlocked ? 'Block' : 'Unblock'}
                </button>
            ),
        },
    ];

    return (
        <div className="text-center mx-10">
            <h1 className="font-semibold text-5xl mt-4 mb-10">Users Management</h1>
            <div className="flex flex-row justify-end my-2">
                <SearchBar placeholder={'search with name'} onSearch={setSearchKey} />
            </div>
            <Table columns={columns} data={usersData} numberOfPages={numberOfPages} fetchData={fetchUsers} />
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