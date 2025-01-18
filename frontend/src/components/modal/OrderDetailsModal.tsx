import { Typography, Box, Modal, IconButton, Divider, Grid, Backdrop, Fade } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateWithTime } from '../../utils';
import { IRestaurantOrder } from '../../types';

interface IOrderDetailsModalProps {
    modalOpen: boolean;
    handleCloseModal: () => void;
    selectedOrder: IRestaurantOrder;
}

const OrderDetailsModal: React.FC<IOrderDetailsModalProps> = ({
    modalOpen,
    handleCloseModal,
    selectedOrder,
}) => {
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
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
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
                                <Typography variant="body2">
                                    Name: {selectedOrder?.userDetails?.name}
                                </Typography>
                                <Typography variant="body2">
                                    Email: {selectedOrder?.userDetails?.email}
                                </Typography>
                                <Typography variant="body2">
                                    Address: {selectedOrder?.address?.address}, {selectedOrder?.address?.city}
                                    , {selectedOrder?.address?.country}
                                </Typography>
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
                                                <Typography variant="body2">{item.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                        <CurrencyRupeeIcon style={{ fontSize: '0.85rem' }} />
                                                        {item.price} x {item.quantity}
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
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                    Total Amount: <CurrencyRupeeIcon style={{ fontSize: '1.15rem' }} />
                                    {selectedOrder?.totalAmount}
                                </Typography>
                                <Typography variant="body2">Order Status: {selectedOrder?.status}</Typography>
                                <Typography variant="body2">
                                    Order Date: {formatDateWithTime(selectedOrder?.createdAt)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default OrderDetailsModal;
