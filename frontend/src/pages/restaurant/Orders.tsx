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
    Modal,
    IconButton,
    Divider,
    Grid,
    Backdrop,
    Fade,
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { getRestaurantOrdersApi, updateOrderStatusApi } from '../../api/apiMethods/order';
import { useAppSelector } from '../../redux/hooks';
import OrdersTableRestaurantSkelton from '../../components/shimmer/OrdersTableRestaurantSkelton';
import { IRestaurantOrder } from '../../types';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateWithTime } from '../../utils/date-format';
import { hotToastMessage } from '../../utils/hotToast';

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
        console.log("adfh");
        
        const response = await updateOrderStatusApi(id, newStatus);
        console.log(response);
        
        hotToastMessage(response.message, 'success')
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
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 900,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5">Order Details</Typography>
                            <IconButton edge="end" color="inherit" onClick={handleCloseModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        {selectedOrder && (
                            <Box sx={{ padding: 2 }}>
                                <Grid container spacing={3}>
                                    {/* Customer Information */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom>
                                            Customer Information
                                        </Typography>
                                        <Typography variant="body1">Name: {selectedOrder.userDetails.name}</Typography>
                                        <Typography variant="body1">Email: {selectedOrder.userDetails.email}</Typography>
                                        <Typography variant="body1">
                                            Address: {selectedOrder.address.address}
                                            City: {selectedOrder.address.city}
                                            Country: {selectedOrder.address.country}
                                        </Typography>
                                    </Grid>

                                    {/* Ordered Items */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" gutterBottom>
                                            Ordered Items
                                        </Typography>
                                        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                            {selectedOrder.orderedItems.map((item, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                                                >
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.item}
                                                        style={{
                                                            width: '80px',
                                                            borderRadius: '5px',
                                                            marginRight: '10px',
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2">{item.item}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                       <span className='flex items-center '>
                                                       <CurrencyRupeeIcon style={{ fontSize: '0.85rem' }} />{item.price}
                                                       </span>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>

                                    {/* Order Details */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ margin: '16px 0' }} />
                                        <Typography variant="h6" className='flex items-center'>Total Amount: <CurrencyRupeeIcon style={{ fontSize: '1.15rem' }} />{selectedOrder.totalAmound}</Typography>
                                        <Typography variant="body1">Order Status: {selectedOrder.status}</Typography>
                                        <Typography variant="body1">Order Date: {formatDateWithTime(selectedOrder.createdAt)}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default OrdersListPage;
