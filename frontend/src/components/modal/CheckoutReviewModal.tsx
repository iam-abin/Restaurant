import { FormEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import LoaderCircle from '../Loader/LoaderCircle';
import { useAppSelector } from '../../redux/hooks';
import { checkoutOrderApi } from '../../api/apiMethods/order';
import { IAddress, ICart, ICheckoutResponse } from '../../types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '45%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function CheckoutReviewModal({
    isOpen,
    handleClose,
}: {
    isOpen: boolean;
    handleClose: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const { authData } = useAppSelector((store) => store.authReducer);
    const { myProfile } = useAppSelector((store) => store.profileReducer);
    const { cartData } = useAppSelector((store) => store.cartReducer);

    const [input, setInput] = useState({
        name: authData?.name || '',
        email: authData?.email || '',
        phone: authData?.phone ? authData.phone.toString() : '',
        address: (myProfile?.addressId as IAddress)?.address || '',
        city: (myProfile?.addressId as IAddress)?.city || '',
        country: (myProfile?.addressId as IAddress)?.country || '',
    });

    // useEffect(()=>{
    //     (
    //         async()=>{
    //             const
    //         }
    //     )()
    // })

    const paymentCheckoutHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(cartData);
        if(!cartData) return

        const cartItem: ICart = cartData[0];

        const restaurantId = cartItem.restaurantId;


        setIsLoading(true);

        try {
            const response = await checkoutOrderApi({restaurantId});
            window.location.href = (response.data as ICheckoutResponse).stripePaymentUrl;
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <Modal
                keepMounted
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    {/* Close button at the top-right corner */}
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
                    <div className="flex justify-center">
                        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                            Review your order
                        </Typography>
                    </div>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        Double-check your delivery details and ensure everything is in order. When you are
                        ready, hit confirm button to finalize your order
                    </Typography>
                    {/* Form */}
                    <form
                        onSubmit={paymentCheckoutHandler}
                        className="mt-4 md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
                    >
                        <div>
                            <label className="text-sm">Fullname</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="name"
                                value={input.name}
                                // onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label className="text-sm">Email</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                disabled
                                type="email"
                                name="email"
                                value={authData?.email}
                                // onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label className="text-sm">Contact</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="contact"
                                value={'73054654351'}
                                // onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label className="text-sm">Address</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="address"
                                value={input.address}
                                // onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label className="text-sm">City</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="city"
                                value={input.city}
                                // onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label className="text-sm">Country</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="country"
                                value={input.country}
                                // onChange={changeEventHandler}
                            />
                        </div>
                        <Button type="submit" variant="contained" className=" h-10 col-Typography-2 pt-5">
                            {isLoading ? (
                                <>
                                    Please wait
                                    <LoaderCircle />
                                </>
                            ) : (
                                <>Continue To Payment</>
                            )}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
