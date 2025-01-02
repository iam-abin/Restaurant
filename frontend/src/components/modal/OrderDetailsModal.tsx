import { Typography, Box, Modal, IconButton, Divider, Grid, Backdrop, Fade } from '@mui/material';

import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateWithTime } from '../../utils/date-format';
import { IRestaurantOrder } from '../../types';

const OrderDetailsModal = ({
    modalOpen,
    handleCloseModal,
    selectedOrder,
}: {
    modalOpen: boolean;
    handleCloseModal: () => void;
    selectedOrder: IRestaurantOrder;
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
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={3}>
                            {/* Customer Information */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    Customer Information
                                </Typography>
                                <Typography variant="body1">
                                    Name: {selectedOrder?.userDetails?.name}
                                </Typography>
                                <Typography variant="body1">
                                    Email: {selectedOrder?.userDetails?.email}
                                </Typography>
                                <Typography variant="body1">
                                    Address: {selectedOrder?.address?.address}
                                    City: {selectedOrder?.address?.city}
                                    Country: {selectedOrder?.address?.country}
                                </Typography>
                            </Grid>

                            {/* Ordered Items */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>
                                    Ordered Items
                                </Typography>
                                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {selectedOrder?.orderedItems?.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                style={{
                                                    width: '80px',
                                                    borderRadius: '5px',
                                                    marginRight: '10px',
                                                }}
                                            />
                                            <Box>
                                                <Typography variant="body2">{item.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <span className="flex items-center ">
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
                                <Typography variant="h6" className="flex items-center">
                                    Total Amount: <CurrencyRupeeIcon style={{ fontSize: '1.15rem' }} />
                                    {selectedOrder?.totalAmount}
                                </Typography>
                                <Typography variant="body1">Order Status: {selectedOrder?.status}</Typography>
                                <Typography variant="body1">
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
