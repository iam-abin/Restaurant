import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { getMyOrdersApi } from '../../api/apiMethods';
import { IRestaurantOrder, Orders } from '../../types';
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';
import OrderCardSkelton from '../../components/shimmer/OrderCardSkelton';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import OrderCard from '../../components/cards/OrderCard';
import usePagination from '../../hooks/usePagination';

const OrdersUser: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<IRestaurantOrder | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [orders, setOrders] = useState<IRestaurantOrder[]>([]);
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const orders = await getMyOrdersApi(currentPage, 2);
                setOrders((orders.data as Orders).orders);
                setTotalNumberOfPages((orders.data as Orders).numberOfPages);
            } finally {
                setLoading(false);
            }
        })();
    }, [currentPage]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOrderDetailsModalOpen = (order: any): void => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleCloseModal = (): void => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Orders List
            </Typography>
            <div className="flex flex-col gap-2">
                {loading
                    ? Array.from(new Array(3)).map((_, index: number) => <OrderCardSkelton key={index} />)
                    : orders.map((order: IRestaurantOrder) => (
                          <OrderCard
                              key={order._id}
                              order={order}
                              handleModalOpen={handleOrderDetailsModalOpen}
                          />
                      ))}
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    modalOpen={modalOpen}
                    handleCloseModal={handleCloseModal}
                    selectedOrder={selectedOrder}
                />
            )}
            <div className="flex justify-center my-10">
                <PaginationButtons
                    handlePageChange={handlePageChange}
                    numberOfPages={totalNumberOfPages}
                    currentPage={currentPage}
                />
            </div>
        </Box>
    );
};

export default OrdersUser;
