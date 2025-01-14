import { useEffect, useState } from 'react';

import { IResponse, IProfile, IProfilesResponse, IUser } from '../../types';
import { hotToastMessage } from '../../utils/hotToast';
import { getProfilesApi, blockUnblockUserApi } from '../../api/apiMethods';
import SearchBar from '../../components/search/SearchBar';
import Table from '../../components/table/Table';
import { useConfirmationContext } from '../../context/confirmationContext';
import { Chip } from '@mui/material';
import CustomButton from '../../components/Button/CustomButton';

const UsersList: React.FC = () => {
    const [profilesData, setProfilesData] = useState<IProfile[]>([]);
    const [numberOfPages, setNumberOfPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const { showConfirmation } = useConfirmationContext();

    const USERS_PER_PAGE: number = 2;

    const fetchUsers = async (currentPage: number): Promise<void> => {
        let profilesData: IResponse | [] = [];
        // if (!searchKey) {
        profilesData = await getProfilesApi(currentPage, USERS_PER_PAGE);
        const data = profilesData?.data as IProfilesResponse;
        setProfilesData(data.profiles as IProfile[]);
        setNumberOfPages(data.numberOfPages);
    };

    useEffect(() => {
        fetchUsers(1); // Fetch initial data for the first page
    }, [searchKey, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKey]);

    const handleBlockUnblockButton = (userId: string, isBlocked: boolean) => {
        showConfirmation({
            title: `Do you want to ${isBlocked ? 'unblock' : 'block'} this user`,
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
                <Chip
                    label={row?.userId?.isBlocked ? 'inActive' : 'active'}
                    color={row?.userId?.isBlocked ? 'error' : 'success'}
                    variant="filled"
                />
            ),
        },
        {
            Header: 'Action',
            button: (row: { userId: { _id: string; isBlocked: boolean } }) => (
                <CustomButton
                    sx={{
                        backgroundColor: row.userId.isBlocked ? '#3B9212' : '#D10000',
                        '&:hover': {
                            backgroundColor: row.userId.isBlocked ? '#2B690D' : '#A30000',
                        },
                        fontWeight: 'bold',
                    }}
                    onClick={() => {
                        handleBlockUnblockButton(row.userId._id, row.userId.isBlocked);
                    }}
                    variant="contained"
                >
                    {row.userId.isBlocked ? 'Unblock' : 'Block'}
                </CustomButton>
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
        </div>
    );
};

export default UsersList;
