import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import LoaderCircle from '../Loader/LoaderCircle';
import { useAppSelector } from '../../redux/hooks';
import { checkoutOrderApi } from '../../api/apiMethods/order';
import { IAddress, ICart, ICheckoutResponse } from '../../types';
import { hotToastMessage } from '../../utils';
import CustomButton from '../Button/CustomButton';
import { Link } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '75%', md: '60%', lg: '45%' },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

interface ICheckoutReviewModalProps {
    isOpen: boolean;
    handleClose: () => void;
}

const CheckoutReviewModal: React.FC<ICheckoutReviewModalProps> = ({ isOpen, handleClose }) => {
    const [isLoading, setIsLoading] = useState(false);

    const { authData } = useAppSelector((store) => store.authReducer);
    const { myProfile } = useAppSelector((store) => store.profileReducer);
    const { cartData } = useAppSelector((store) => store.cartReducer);

    const paymentCheckoutHandler = async (): Promise<void> => {
        if (!cartData) return;

        const cartItem: ICart = cartData[0];
        const restaurantId: string = cartItem.restaurantId;
        setIsLoading(true);

        try {
            const response = await checkoutOrderApi({ restaurantId });
            window.location.href = (response.data as ICheckoutResponse).stripePaymentUrl;
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            keepMounted
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="checkout-review-modal-title"
            aria-describedby="checkout-review-modal-description"
        >
            <Box sx={style}>
                {/* Close button */}
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>

                {/* Header */}
                <Typography
                    id="checkout-review-modal-title"
                    variant="h6"
                    component="h2"
                    align="center"
                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                    Review your order
                </Typography>

                {/* Description */}
                <Typography
                    id="checkout-review-modal-description"
                    sx={{ mt: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    align="center"
                >
                    Double-check your delivery details and ensure everything is in order. When you are ready,
                    hit confirm to finalize your order.
                </Typography>

                {/* Information Display */}
                <Box sx={{ mt: 4, spaceY: 3, px: { xs: 1, sm: 3 } }}>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        <strong>Fullname:</strong> <span>{authData?.name || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        <strong>Email:</strong> <span>{authData?.email || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        <strong>Contact:</strong> <span>{authData?.phone || '73054654351'}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        <strong>Address:</strong>{' '}
                        <span>{(myProfile?.addressId as IAddress)?.address || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        <strong>City:</strong>{' '}
                        <span>{(myProfile?.addressId as IAddress)?.city || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                        <strong>Country:</strong>{' '}
                        <span>{(myProfile?.addressId as IAddress)?.country || 'N/A'}</span>
                    </Typography>
                </Box>

                {/* Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'flex-end',
                        mt: 5,
                        gap: 2,
                    }}
                >
                    <Link to={'/profile'} style={{ textDecoration: 'none' }}>
                        <CustomButton variant="outlined">Update Details</CustomButton>
                    </Link>
                    <CustomButton onClick={paymentCheckoutHandler}>
                        {isLoading ? (
                            <>
                                Please wait
                                <LoaderCircle />
                            </>
                        ) : (
                            <>Continue To Payment</>
                        )}
                    </CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default CheckoutReviewModal;
