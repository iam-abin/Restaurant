import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Typography,
    Box,
    Button,
} from '@mui/material';
import { getRestaurantOrdersApi, updateOrderStatusApi } from '../../api/apiMethods/order';
import { useAppSelector } from '../../redux/hooks';
import OrdersTableRestaurantSkelton from '../../components/shimmer/OrdersTableRestaurantSkelton';
import { IRestaurantOrder } from '../../types';
import { hotToastMessage } from '../../utils/hotToast';
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';

const OrdersListPage: React.FC = () => {
    const [orders, setOrders] = useState<IRestaurantOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<IRestaurantOrder | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const restaurant = useAppSelector((store) => store.restaurantReducer.restaurantData?.restaurant);

    useEffect(() => {
        (async () => {
            if (restaurant?._id) {
                setLoading(true);
                try {
                    const orders = await getRestaurantOrdersApi(restaurant._id);
                    setOrders(orders.data as IRestaurantOrder[]);
                } finally {
                    setLoading(false);
                }
            }
        })();
    }, [restaurant]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order._id === id ? { ...order, status: newStatus } : order)),
        );
        const response = await updateOrderStatusApi(id, newStatus);

        hotToastMessage(response.message, 'success');
    };

    const handleViewDetails = (order: IRestaurantOrder) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const statuses = ['preparing', 'outfordelivery', 'delivered'];
    const tableColumns = ['Image', 'OrderId', 'Customer', 'Total', 'Status', 'Actions'];

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Orders List
            </Typography>
            {loading ? (
                <OrdersTableRestaurantSkelton />
            ) : orders.length ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableColumns.map((column: string) => (
                                    <TableCell key={column}>{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>
                                        <img
                                            src={order.orderedItems[0].imageUrl}
                                            alt="img not available"
                                            style={{ width: '50px', borderRadius: '5px' }}
                                        />
                                    </TableCell>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{order.userDetails.email}</TableCell>
                                    <TableCell>{order.totalAmound}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        >
                                            <MenuItem value={order.status}>{order.status}</MenuItem>
                                            {statuses.map((item: string) => (
                                                <MenuItem key={item} value={item}>
                                                    {item}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                    <h1 className="mt-4 text-2xl font-semibold text-gray-800">No Orders Yet!</h1>
                    <p className="mt-2 text-gray-600">It looks like you haven't received any orders.</p>
                    <Button
                        variant="contained"
                        color="primary"
                        className="mt-6"
                        onClick={() => alert('Redirecting to menu...')}
                    >
                        Browse Menu
                    </Button>
                </div>
            )}

            {/* Order Details Modal using Modal component */}
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
