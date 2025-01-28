import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Typography, Box } from '@mui/material';

import { getMyOrdersApi } from '../../api/apiMethods';
import { IResponse, IRestaurantOrder, Orders } from '../../types';
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';
import OrderCardSkelton from '../../components/shimmer/OrderCardSkelton';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import OrderCard from '../../components/cards/OrderCard';
import usePagination from '../../hooks/usePagination';
import { DEFAULT_LIMIT_VALUE } from '../../constants';
import CustomButton from '../../components/Button/CustomButton';
import { hotToastMessage } from '../../utils';

const OrdersUser: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOrder, setSelectedOrder] = useState<IRestaurantOrder | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [orders, setOrders] = useState<IRestaurantOrder[]>([]);
    const navigate = useNavigate();
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const orders: IResponse = await getMyOrdersApi(currentPage, DEFAULT_LIMIT_VALUE);
                setOrders((orders.data as Orders).orders);
                setTotalNumberOfPages((orders.data as Orders).numberOfPages);
            } catch (error: unknown) {
                hotToastMessage((error as Error).message, 'error');
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
            {/* Orders list */}
            <div className="flex flex-col flex-grow gap-2">
                {orders.length === 0 && loading ? (
                    Array.from(new Array(DEFAULT_LIMIT_VALUE)).map((_, index: number) => (
                        <OrderCardSkelton key={index} />
                    ))
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <h1 className="mt-4 text-2xl font-semibold text-gray-800">No Orders Yet!</h1>
                        <p className="mt-2 text-sm md:text-lg text-gray-600">
                            It looks like you haven&apos;t made any orders.
                        </p>
                        <p className="mt-2 font-bold text-gray-700">Lets find restaurants</p>

                        <CustomButton className="mt-6" onClick={() => navigate('/')}>
                            Go to home
                        </CustomButton>
                    </div>
                ) : (
                    orders.map((order: IRestaurantOrder) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            handleModalOpen={handleOrderDetailsModalOpen}
                        />
                    ))
                )}
            </div>

            <div className="flex justify-center my-10">
                <PaginationButtons
                    handlePageChange={handlePageChange}
                    numberOfPages={totalNumberOfPages}
                    currentPage={currentPage}
                />
            </div>

            {/* Ordetails modal */}
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

export default OrdersUser;
