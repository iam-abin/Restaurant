import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Grid } from '@mui/material';
import { getMyOrdersApi } from '../../api/apiMethods/order';
import { IMenu } from '../../types';

// interface
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

const Orders: React.FC = () => {
    const [orders, setOrders] = useState(dummyOrders);

    useEffect(() => {
        (async () => {
            const orders = await getMyOrdersApi();
            setOrders(orders.data as any);
        })();
    }, []);

    // const handleStatusChange = (id: number, newStatus: string) => {
    //     setOrders((prevOrders) =>
    //         prevOrders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)),
    //     );
    // };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Orders List
            </Typography>
            <Grid container spacing={3}>
                {orders.map((order: any) => (
                    <Grid item xs={12} key={order._id}>
                        <Card sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 120, height: 120, borderRadius: 2, margin: 2 }}
                                image={order.imageUrl}
                                alt={order.name}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <CardContent>
                                    <Typography variant="h6">{order.restaurantDetails}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        items:{' '}
                                        {order.items &&
                                            order.items.map(
                                                (item: IMenu, index: number) =>
                                                    `${item.name}${index == order.items.length - 1 ? '' : ', '}`,
                                            )}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Total price:{' '}
                                        {order.items &&
                                            order.items.reduce((acc: number, curr: IMenu) => {
                                                return (acc += curr.price);
                                            }, 0)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                                        Status:
                                        {order.status}
                                    </Typography>
                                </CardContent>
                            </Box>
                            <Box sx={{ padding: 2 }}>
                                <Button variant="contained" color="primary" size="small">
                                    View Details
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Orders;
