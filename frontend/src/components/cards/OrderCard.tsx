import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { IRestaurantOrder, OrderItem } from '../../types';
import CustomButton from '../Button/CustomButton';
import ChipCustom from '../chip/OrderChip';

interface IOrderCardProps {
    order: IRestaurantOrder;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleModalOpen: (order: any) => void;
}

const OrderCard: React.FC<IOrderCardProps> = ({ order, handleModalOpen }) => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' }, // Column for small devices, row for larger screens
                alignItems: { xs: 'center', sm: 'center' },
                width: '100%', // Full width for better responsiveness
            }}
        >
            <CardMedia
                component="img"
                sx={{
                    width: { xs: '100%', sm: 120 }, // Full width on small devices, fixed width on larger screens
                    height: { xs: 200, sm: 120 }, // Increased height for better appearance on small devices
                    borderRadius: 2,
                    margin: 2,
                }}
                image={order?.orderedItems[0]?.imageUrl}
                alt={'image not available'}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    textAlign: { xs: 'center', sm: 'left' }, // Center-align text on small screens
                }}
            >
                <CardContent>
                    <Typography variant="h6">{order.restaurantDetails.name}</Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                        <span className="font-bold">Items: </span>
                        <span>
                            {order.orderedItems &&
                                order.orderedItems.map(
                                    (item: OrderItem, index: number) =>
                                        `${item.name}${index === order.orderedItems.length - 1 ? '' : ', '}`,
                                )}
                        </span>
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                        <span className="flex items-center">
                            <span className="font-bold"> Total price: </span>
                            <span className="flex items-center">
                                ₹ <span>{order.orderedItems && order.totalAmount}</span>
                            </span>
                        </span>
                    </Typography>
                    <div className="text-sm font-bold">
                        <span>Status:</span> <ChipCustom status={order.status} />
                    </div>
                </CardContent>
            </Box>
            <Box
                sx={{
                    padding: 2,
                    textAlign: { xs: 'center', sm: 'right' }, // Center-align the button on small screens
                }}
            >
                <CustomButton onClick={() => handleModalOpen(order)}>View Details</CustomButton>
            </Box>
        </Card>
    );
};

export default OrderCard;
