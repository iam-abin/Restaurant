import { useEffect, useState } from 'react';

import { IResponse, IUser } from '../../types';
import { hotToastMessage } from '../../utils';
import { blockUnblockUserApi } from '../../api/apiMethods';
import SearchBar from '../../components/search/SearchBar';
import Table from '../../components/table/Table';
import { useConfirmationContext } from '../../context/confirmationContext';
import { Chip } from '@mui/material';
import CustomButton from '../../components/Button/CustomButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateUserProfileBlockStatus } from '../../redux/slice/profileSlice';
import { fetchProfiles, searchProfiles } from '../../redux/thunk/profileThunk';

const UsersList: React.FC = () => {
    const [numberOfPages, setNumberOfPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const { showConfirmation } = useConfirmationContext();
    const profilesData = useAppSelector((store) => store.profileReducer.userProfileListData);

    const dispatch = useAppDispatch();
    const USERS_PER_PAGE: number = 2;

    const fetchUsers = async (currentPage: number): Promise<void> => {
        if (!searchKey) {
            dispatch(
                fetchProfiles({
                    setTotalNumberOfPages: setNumberOfPages,
                    currentPage,
                    limit: USERS_PER_PAGE,
                }),
            );
        } else {
            dispatch(
                searchProfiles({
                    searchKey,
                    setTotalNumberOfPages: setNumberOfPages,
                    currentPage,
                    limit: USERS_PER_PAGE,
                }),
            );
        }
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
        try {
            const updatedUser: IResponse | null = await blockUnblockUserApi(userId);

            if (updatedUser) {
                hotToastMessage(updatedUser.message, 'success');
                dispatch(
                    updateUserProfileBlockStatus({
                        userId,
                        isBlocked: (updatedUser.data as IUser).isBlocked,
                    }),
                );
            }
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
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
                        backgroundColor: row?.userId?.isBlocked ? '#3B9212' : '#D10000',
                        '&:hover': {
                            backgroundColor: row?.userId?.isBlocked ? '#2B690D' : '#A30000',
                        },
                        fontWeight: 'bold',
                    }}
                    onClick={() => {
                        handleBlockUnblockButton(row?.userId?._id, row?.userId?.isBlocked);
                    }}
                    variant="contained"
                >
                    {row?.userId?.isBlocked ? 'Unblock' : 'Block'}
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
                data={profilesData!}
                numberOfPages={numberOfPages}
                fetchData={fetchUsers}
            />
        </div>
    );
};

export default UsersList;
