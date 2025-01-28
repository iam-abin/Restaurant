import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { updateOrderStatusApi } from '../../api/apiMethods';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import OrdersTableRestaurantSkelton from '../../components/shimmer/OrdersTableRestaurantSkelton';
import { IResponse, IRestaurantOrder, OrderStatus } from '../../types';
import { hotToastMessage } from '../../utils';
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import usePagination from '../../hooks/usePagination';
import CustomButton from '../../components/Button/CustomButton';
import { DEFAULT_LIMIT_VALUE } from '../../constants';
import { fetchRestaurantOrders } from '../../redux/thunk/orderThunk';
import { updateOrderStatus } from '../../redux/slice/orderSlice';

const OrdersListPage: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<IRestaurantOrder | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});
    const restaurant = useAppSelector((store) => store.restaurantReducer.restaurantData?.restaurant);
    const { restaurantOrdersList, status } = useAppSelector((store) => store.orderReducer);

    useEffect(() => {
        (async () => {
            if (restaurant?._id) {
                dispatch(
                    fetchRestaurantOrders({
                        restaurantId: restaurant._id,
                        setTotalNumberOfPages,
                        currentPage,
                        limit: DEFAULT_LIMIT_VALUE,
                    }),
                );
            }
        })();
    }, [restaurant, currentPage]);

    const handleStatusChange = async (orderId: string, newStatus: string): Promise<void> => {
        try {
            const response: IResponse | null = await updateOrderStatusApi(orderId, newStatus);
            if (response) {
                hotToastMessage(response.message, 'success');
                dispatch(
                    updateOrderStatus({
                        orderId,
                        status: newStatus,
                    }),
                );
            }
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        }
    };

    const handleViewDetails = (order: IRestaurantOrder): void => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const orderStatuses: OrderStatus[] = ['preparing', 'outfordelivery', 'delivered'];
    const tableColumns: string[] = ['Image', 'OrderId', 'Customer', 'Total', 'Status', 'Actions'];

    const handleCloseModal = (): void => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Orders List
            </Typography>
            {/* Orders list table */}
            {status === 'loading' && restaurantOrdersList.length === 0 ? (
                <OrdersTableRestaurantSkelton rowCount={DEFAULT_LIMIT_VALUE} />
            ) : restaurantOrdersList.length ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableColumns.map((column: string) => (
                                    <TableCell align="center" key={column}>
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restaurantOrdersList.map((order: IRestaurantOrder) => (
                                <TableRow key={order._id}>
                                    <TableCell align="center">
                                        <img
                                            src={order.orderedItems[0].imageUrl}
                                            alt="img not available"
                                            style={{ width: '50px', borderRadius: '5px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{order._id}</TableCell>
                                    <TableCell align="center">{order.userDetails.email}</TableCell>
                                    <TableCell align="center">₹{order.totalAmount}</TableCell>
                                    <TableCell align="center">
                                        <Select
                                            fullWidth
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        >
                                            <MenuItem value={order.status}>{order.status}</MenuItem>
                                            {orderStatuses
                                                .filter((status) => status !== order.status)
                                                .map((item) => (
                                                    <MenuItem key={item} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <CustomButton onClick={() => handleViewDetails(order)}>
                                            View Details
                                        </CustomButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="mt-4 text-2xl font-semibold text-gray-800">No Orders Yet!</h1>
                    <p className="mt-2 text-gray-600">It looks like you haven&apos;t received any orders.</p>

                    <CustomButton className="mt-6" onClick={() => navigate('/')}>
                        Go to home
                    </CustomButton>
                </div>
            )}

            <div className="flex justify-center my-10">
                <PaginationButtons
                    handlePageChange={handlePageChange}
                    numberOfPages={totalNumberOfPages}
                    currentPage={currentPage}
                />
            </div>
            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    modalOpen={modalOpen}
                    handleCloseModal={handleCloseModal}
                    selectedOrder={selectedOrder}
                />
            )}
        </Box>
    );
};

export default OrdersListPage;
