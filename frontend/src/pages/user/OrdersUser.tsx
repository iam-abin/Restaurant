import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Grid } from '@mui/material';

import { getMyOrdersApi } from '../../api/apiMethods';
import { IMenu, IRestaurantOrder, Orders } from '../../types';
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';
import OrderCardSkelton from '../../components/shimmer/OrderCardSkelton';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import usePagination from '../../hooks/usePagination';

const OrdersUser: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<IRestaurantOrder | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [orders, setOrders] = useState<IRestaurantOrder[]>([]);
    const {currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages} = usePagination({});
 
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const orders = await getMyOrdersApi(currentPage);
                setOrders((orders.data as Orders).orders);
                setTotalNumberOfPages((orders.data as Orders).numberOfPages);
            } finally {
                setLoading(false);
            }
        })();
    }, [currentPage]);

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
                                              Total price: {order.orderedItems && order.totalAmount}
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
            <div className="flex justify-center my-10">
                <PaginationButtons handlePageChange={handlePageChange} numberOfPages={totalNumberOfPages} currentPage={currentPage}/>
            </div>
        </Box>
    );
};

export default OrdersUser;
