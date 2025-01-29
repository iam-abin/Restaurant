import { Typography, Box, Modal, IconButton, Divider, Grid, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { checkRole, formatDateWithTime, generatePdf } from '../../utils';
import { IRestaurantOrder, UserRole } from '../../types';
import ChipCustom from '../chip/OrderChip';
import { useAppSelector } from '../../redux/hooks';
import CustomButton from '../Button/CustomButton';
import autoTable from 'jspdf-autotable';
import 'jspdf';
import { useConfirmationContext } from '../../context/confirmationContext';

declare module 'jspdf' {
    interface jsPDF {
        previousAutoTable?: {
            finalY: number;
        };
    }
}

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
    const { showConfirmation } = useConfirmationContext();

    const handleDownloadInvoiceButton = () => {
        showConfirmation({
            title: 'Do you want to download the invoice',
            description: 'Are you sure?',
            onAgree: () => handleInvoiceGeneration(),
            closeText: 'No',
            okayText: 'Yes',
        });
    };

    const handleInvoiceGeneration = (): void => {
        if (!selectedOrder) return;

        const headers = ['Item', 'Quantity', 'Price', 'Total'];
        const rows = selectedOrder?.orderedItems?.map((item) => [
            item.name,
            item.quantity.toString(),
            item.price,
            item.price * item.quantity,
        ]);

        const customerInfo = {
            Name: selectedOrder.userDetails?.name,
            Email: selectedOrder.userDetails?.email,
            Phone: selectedOrder.userDetails?.phone,
            Address: `${selectedOrder.address?.address}, ${selectedOrder.address?.city}, ${selectedOrder.address?.country}`,
        };

        const restaurantInfo = {
            Name: selectedOrder.restaurantDetails?.name,
            Email: selectedOrder.restaurantDetails?.email,
            Phone: selectedOrder.restaurantDetails?.phone,
        };

        generatePdf({
            title: 'Order Invoice',
            generatePdfCallback: (doc) => {
                // Add Customer Info
                doc.setFontSize(12);
                doc.text('Customer Information', 10, 30);
                doc.setFontSize(10);
                let startY = 35;
                Object.entries(customerInfo).forEach(([key, value]) => {
                    doc.text(`${key}: ${value || 'N/A'}`, 10, startY);
                    startY += 5;
                });

                // Add Restaurant Info
                startY += 5;
                doc.setFontSize(12);
                doc.text('Restaurant Information', 10, startY);
                doc.setFontSize(10);
                startY += 5;
                Object.entries(restaurantInfo).forEach(([key, value]) => {
                    doc.text(`${key}: ${value || 'N/A'}`, 10, startY);
                    startY += 5;
                });

                // Add Ordered Items Table
                startY += 10;
                autoTable(doc, {
                    theme: 'plain',
                    startY,
                    head: [headers],
                    body: rows || [],
                });

                // Add Total Amount
                const finalY = doc.previousAutoTable?.finalY || startY + 10;
                doc.setFontSize(12);
                doc.text(
                    `Total Amount paid: ₹${parseFloat(selectedOrder.totalAmount.toFixed(2)).toLocaleString('en-IN')}`,
                    10,
                    finalY + 10,
                );

                // Save PDF
                doc.save('order_invoice.pdf');
            },
        });
    };

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
                                <Box className="flex gap-2 justify-between">
                                    <Box className="flex">
                                        <Typography variant="subtitle2">Order Status:</Typography>
                                        <ChipCustom status={selectedOrder?.status} />
                                    </Box>
                                    {isUser && (
                                        <Box>
                                            <CustomButton
                                                onClick={handleDownloadInvoiceButton}
                                                variant="text"
                                            >
                                                download invoice
                                            </CustomButton>
                                        </Box>
                                    )}
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
