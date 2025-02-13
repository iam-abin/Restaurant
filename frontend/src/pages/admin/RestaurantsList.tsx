import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import { IResponse, IUser } from '../../types';
import SearchBar from '../../components/search/SearchBar';
import Table from '../../components/table/Table';
import { hotToastMessage } from '../../utils';
import { blockUnblockUserApi } from '../../api/apiMethods/auth';
import { useConfirmationContext } from '../../context/confirmationContext';
import CustomButton from '../../components/Button/CustomButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchRestaurants, searchRestaurants } from '../../redux/thunk/restaurantThunk';
import { updateRestaurantBlockStatus } from '../../redux/slice/restaurantSlice';
import { DEFAULT_LIMIT_VALUE } from '../../constants';

const RestaurantsList: React.FC = () => {
    const [numberOfPages, setNumberOfPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const { showConfirmation } = useConfirmationContext();
    const { restaurantListData } = useAppSelector((store) => store.restaurantReducer);

    const dispatch = useAppDispatch();

    const fetchAllRestaurants = async (currentPage: number): Promise<void> => {
        if (!searchKey) {
            dispatch(
                fetchRestaurants({
                    setTotalNumberOfPages: setNumberOfPages,
                    currentPage,
                    limit: DEFAULT_LIMIT_VALUE,
                }),
            );
        } else {
            dispatch(
                searchRestaurants({
                    searchKey,
                    setTotalNumberOfPages: setNumberOfPages,
                    currentPage,
                    limit: DEFAULT_LIMIT_VALUE,
                }),
            );
        }
    };

    useEffect(() => {
        fetchAllRestaurants(currentPage); // Fetch initial data for the first page
    }, [searchKey, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKey]);

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
        try {
            const updatedUser: IResponse | null = await blockUnblockUserApi(userId);

            if (updatedUser) {
                hotToastMessage(updatedUser.message, 'success');
                dispatch(
                    updateRestaurantBlockStatus({
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
        { Header: 'Name', accessor: 'ownerId.name' },
        { Header: 'Email', accessor: 'ownerId.email' },
        { Header: 'Phone', accessor: 'ownerId.phone' },
        {
            Header: 'Profile Image',
            element: (row: { imageUrl: string }) => (
                <div className="flex justify-center items-center">
                    <img src={row.imageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                </div>
            ),
        },
        {
            Header: 'Status',
            element: (row: { ownerId?: { isBlocked: boolean } }) => (
                <Chip
                    label={row?.ownerId?.isBlocked ? 'inActive' : 'active'}
                    color={row?.ownerId?.isBlocked ? 'error' : 'success'}
                    variant="filled"
                />
            ),
        },
        {
            Header: 'Action',
            element: (row: { ownerId: { _id: string; isBlocked: boolean } }) => (
                <CustomButton
                    sx={{
                        backgroundColor: row?.ownerId?.isBlocked ? '#3B9212' : '#D10000',
                        '&:hover': {
                            backgroundColor: row?.ownerId?.isBlocked ? '#2B690D' : '#A30000',
                        },
                        fontWeight: 'bold',
                    }}
                    onClick={() => {
                        handleBlockUnblockButton(row?.ownerId?._id, row?.ownerId?.isBlocked);
                    }}
                >
                    {row?.ownerId?.isBlocked ? 'Unblock' : 'Block'}
                </CustomButton>
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
                data={restaurantListData!}
                numberOfPages={numberOfPages}
                fetchData={fetchAllRestaurants}
            />
        </div>
    );
};

export default RestaurantsList;
