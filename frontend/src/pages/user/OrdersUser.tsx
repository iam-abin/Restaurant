import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Grid } from '@mui/material';

import { getMyOrdersApi } from '../../api/apiMethods';
import { IMenu, IRestaurantOrder } from '../../types';
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';
import OrderCardSkelton from '../../components/shimmer/OrderCardSkelton';

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<IRestaurantOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<IRestaurantOrder | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const orders = await getMyOrdersApi();
                setOrders(orders.data as IRestaurantOrder[]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOpen = (order: any) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Orders List
            </Typography>
            <Grid container spacing={3}>
                {loading
                    ? Array.from(new Array(3)).map((_, index: number) => <OrderCardSkelton key={index} />)
                    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      orders.map((order: any) => (
                          <Grid item xs={12} key={order._id}>
                              <Card sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CardMedia
                                      component="img"
                                      sx={{
                                          width: 120,
                                          height: 120,
                                          borderRadius: 2,
                                          margin: 2,
                                      }}
                                      image={order?.orderedItems[0]?.imageUrl}
                                      alt={'image not available'}
                                  />
                                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                      <CardContent>
                                          <Typography variant="h6">{order.restaurantDetails.name}</Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              items:{' '}
                                              {order.orderedItems &&
                                                  order.orderedItems.map(
                                                      (item: IMenu, index: number) =>
                                                          `${item.name}${
                                                              index === order.orderedItems.length - 1
                                                                  ? ''
                                                                  : ', '
                                                          }`,
                                                  )}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              Total price: {order.orderedItems && order.totalAmound}
                                          </Typography>
                                          <Typography variant="body2" sx={{ marginTop: 1 }}>
                                              Status: {order.status}
                                          </Typography>
                                      </CardContent>
                                  </Box>
                                  <Box sx={{ padding: 2 }}>
                                      <Button
                                          variant="contained"
                                          color="primary"
                                          size="small"
                                          onClick={() => handleOpen(order)}
                                      >
                                          View Details
                                      </Button>
                                  </Box>
                              </Card>
                          </Grid>
                      ))}
            </Grid>

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

export default Orders;
