import { Typography, Box, Modal, IconButton, Divider, Grid, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { checkRole, formatDateWithTime } from '../../utils';
import { IRestaurantOrder, UserRole } from '../../types';
import ChipCustom from '../chip/OrderChip';
import { useAppSelector } from '../../redux/hooks';

interface IOrderDetailsModalProps {
    modalOpen: boolean;
    handleCloseModal: () => void;
    selectedOrder: IRestaurantOrder;
}
const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    maxHeight: '95vh',
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
};

const OrderDetailsModal: React.FC<IOrderDetailsModalProps> = ({
    modalOpen,
    handleCloseModal,
    selectedOrder,
}) => {
    const { authData } = useAppSelector((store) => store.authReducer);
    const isUser = checkRole(UserRole.USER, authData?.role);
    return (
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
                <Box sx={style}>
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography id="order-details-title" variant="h5">
                            Order Details
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Content */}
                    <Box sx={{ padding: 1 }}>
                        <Grid container spacing={3}>
                            {/* Customer Information */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" gutterBottom>
                                    Customer Information
                                </Typography>
                                <Box className="flex gap-2">
                                    <Typography variant="subtitle2">Name:</Typography>
                                    <Typography variant="body2">
                                        {selectedOrder?.userDetails?.name}
                                    </Typography>
                                </Box>

                                <Box className="flex gap-2">
                                    <Typography variant="subtitle2">Email:</Typography>
                                    <Typography variant="body2">
                                        {selectedOrder?.userDetails?.email}
                                    </Typography>
                                </Box>

                                <Box className="flex gap-2">
                                    <Typography variant="subtitle2">Phone:</Typography>
                                    <Typography variant="body2">
                                        {selectedOrder?.userDetails?.phone}
                                    </Typography>
                                </Box>

                                <Box className="flex gap-2">
                                    <Typography variant="subtitle2">Address:</Typography>
                                    <Typography variant="body2">
                                        {selectedOrder?.address?.address}, {selectedOrder?.address?.city},{' '}
                                        {selectedOrder?.address?.country}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Ordered Items */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" gutterBottom>
                                    Ordered Items
                                </Typography>
                                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {selectedOrder?.orderedItems?.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2,
                                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                            }}
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '5px',
                                                    marginRight: '10px',
                                                }}
                                            />
                                            <Box>
                                                <Typography variant="subtitle2">{item.name}</Typography>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    <span className="flex items-center justify-center">
                                                        ₹ {item.price} x {item.quantity}
                                                    </span>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Restaurant Information */}
                            {isUser && (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Restaurant Information
                                    </Typography>
                                    <Box className="flex gap-2">
                                        <Typography variant="subtitle2">Name:</Typography>
                                        <Typography variant="body2">
                                            {selectedOrder?.restaurantDetails?.name}
                                        </Typography>
                                    </Box>
                                    <Box className="flex gap-2">
                                        <Typography variant="subtitle2">Email:</Typography>
                                        <Typography variant="body2">
                                            {selectedOrder?.restaurantDetails?.email}
                                        </Typography>
                                    </Box>
                                    <Box className="flex gap-2">
                                        <Typography variant="subtitle2">Phone:</Typography>
                                        <Typography variant="body2">
                                            {selectedOrder?.restaurantDetails?.phone}
                                        </Typography>
                                    </Box>
                                    <Box className="flex gap-2">
                                        <Typography variant="subtitle2">Address:</Typography>
                                        <Typography variant="body2">
                                            {selectedOrder?.address?.address}, {selectedOrder?.address?.city},{' '}
                                            {selectedOrder?.address?.country}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {/* Order Details */}
                            <Grid item xs={12}>
                                <Divider sx={{ margin: '16px 0' }} />
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                    Total Amount: ₹ {selectedOrder?.totalAmount}
                                </Typography>
                                <Box className="flex gap-2">
                                    <Typography variant="subtitle2">Order Status:</Typography>
                                    <ChipCustom status={selectedOrder?.status} />
                                </Box>
                                <Box className="flex gap-2">
                                    <Typography variant="subtitle2">Order Date:</Typography>
                                    <Typography variant="body2">
                                        {formatDateWithTime(selectedOrder?.createdAt)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderDetailsModal;
