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
import { getRestaurantOrdersApi } from '../../api/apiMethods/order';
import { useAppSelector } from '../../redux/hooks';

// Dummy Data
const dummyOrders = [
    {
        id: 1,
        image: 'https://via.placeholder.com/100',
        name: 'Margherita Pizza',
        customer: 'John Doe',
        quantity: 2,
        status: 'Pending',
    },
    {
        id: 2,
        image: 'https://via.placeholder.com/100',
        name: 'Chicken Burger',
        customer: 'Jane Smith',
        quantity: 1,
        status: 'Preparing',
    },
    {
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Caesar Salad',
        customer: 'Alice Johnson',
        quantity: 3,
        status: 'Delivered',
    },
];

const OrdersListPage: React.FC = () => {
    const [orders, setOrders] = useState(dummyOrders);
    const restaurant = useAppSelector((store) => store.restaurantReducer.restaurantData?.restaurant);

    useEffect(() => {
        (
            async ()=>{
                console.log("restaurant---->", restaurant);
                
                if (restaurant?._id) {
                    const orders = await getRestaurantOrdersApi(restaurant._id);
                    setOrders(orders.data)
                 }   
            }
        )()
    }, [restaurant]);

    const handleStatusChange = (id: number, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)),
        );
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Orders List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <img
                                        src={order.image}
                                        alt={order.name}
                                        style={{ width: '50px', borderRadius: '5px' }}
                                    />
                                </TableCell>
                                <TableCell>{order._id}</TableCell>
                                {/* <TableCell>{order.userDetails.name}</TableCell> */}
                                <TableCell>{order.totalAmound}</TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        {/* ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered'], */}
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Preparing">Preparing</MenuItem>
                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" size="small">
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrdersListPage;
