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
import { hotToastMessage } from '../../utils/hotToast';
import CustomButton from '../Button/CustomButton';
import { Link } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '45%',
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
                <Typography id="checkout-review-modal-title" variant="h6" component="h2" align="center">
                    Review your order
                </Typography>

                {/* Description */}
                <Typography id="checkout-review-modal-description" sx={{ mt: 2 }} align="center">
                    Double-check your delivery details and ensure everything is in order. When you are ready,
                    hit confirm to finalize your order.
                </Typography>

                {/* Information Display */}
                <div className="mt-4 space-y-3">
                    <Typography variant="body1">
                        <strong>Fullname:</strong> <span>{authData?.name || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Email:</strong> <span>{authData?.email || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Contact:</strong> <span>{authData?.phone || '73054654351'}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Address:</strong>{' '}
                        <span>{(myProfile?.addressId as IAddress)?.address || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>City:</strong>{' '}
                        <span>{(myProfile?.addressId as IAddress)?.city || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body1">
                        <strong>Country:</strong>{' '}
                        <span>{(myProfile?.addressId as IAddress)?.country || 'N/A'}</span>
                    </Typography>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-5 space-x-3">
                    <Link to={'/profile'}>
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
                </div>
            </Box>
        </Modal>
    );
};

export default CheckoutReviewModal;
