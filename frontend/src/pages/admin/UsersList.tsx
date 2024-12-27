import { useEffect, useState } from 'react';

import { IResponse, IProfile, IProfilesResponse, IUser } from '../../types';
import { hotToastMessage } from '../../utils/hotToast';
import { getProfilesApi, blockUnblockUserApi } from '../../api/apiMethods';
import SearchBar from '../../components/search/SearchBar';
import Table from '../../components/table/Table';

function UsersList() {
    const [profilesData, setProfilesData] = useState<IProfile[]>([]);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState('');

    const USERS_PER_PAGE: number = 2;

    const fetchUsers = async (currentPage: number) => {
        let profilesData: IResponse | [] = [];
        // if (!searchKey) {
        console.log('no search key');
        profilesData = await getProfilesApi(currentPage, USERS_PER_PAGE);
        const data = profilesData?.data as IProfilesResponse;
        // currentPage,
        // USERS_PER_PAGE
        setProfilesData(data.profiles as IProfile[]);

        // if (profilesData) {
        //     setNumberOfPages(profilesData.data.numberOfPages as number);
        setNumberOfPages(data.numberOfPages);
        // }
    };

    useEffect(() => {
        fetchUsers(1); // Fetch initial data for the first page
    }, [searchKey, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKey]);

    const handleBlockUnblock = async (userId: string) => {
        const updatedUser: IResponse | null = await blockUnblockUserApi(userId);

        if (updatedUser) {
            hotToastMessage(updatedUser.message, 'success');

            const profiles: IProfile[] = profilesData.map((user: IProfile) => {
                if ((user.userId as IUser)._id === userId) {
                    return {
                        ...user,
                        userId: {
                            ...(user.userId as IUser),
                            isBlocked: (updatedUser?.data as IUser).isBlocked,
                        },
                    };
                }

                return user;
            });

            setProfilesData(profiles);
        }
    };

    const columns = [
        { Header: 'Name', accessor: 'userId.name' },
        { Header: 'Email', accessor: 'userId.email' },
        { Header: 'Phone', accessor: 'userId.phone' },
        {
            Header: 'Profile Image',
            button: (row: { imageUrl: string }) => (
                <img src={row.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ),
        },
        {
            Header: 'Status',
            button: (row: { userId?: { isBlocked: string } }) => (
                <div
                    className={`badge ${
                        row?.userId?.isBlocked
                            ? 'badge badge-success gap-2 w-20'
                            : 'badge badge-error gap-2 w-20'
                    } `}
                >
                    {row?.userId?.isBlocked ? 'inActive' : 'active'}
                </div>
            ),
        },
        {
            Header: 'Action',
            button: (row: { userId: { _id: string; isBlocked: boolean } }) => (
                <button
                    onClick={() => {
                        handleBlockUnblock(row.userId._id);
                    }}
                    className={`btn ${
                        row.userId.isBlocked
                            ? 'btn btn-error btn-sm w-24 bg-red-600'
                            : 'btn-success btn-sm w-24 bg-green-600'
                    } `}
                >
                    {row.userId.isBlocked ? 'Unblock' : 'Block'}
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
            <Table
                columns={columns}
                data={profilesData}
                numberOfPages={numberOfPages}
                fetchData={fetchUsers}
            />
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

export default UsersList;
