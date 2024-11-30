import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import TableCart from '../../components/table/TableCart';
import CheckoutReviewModal from '../../components/modal/CheckoutReviewModal';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { changeCartItemQuantity, removeCartItem, removeCartItems } from '../../redux/thunk/cartThunk';
import { ICart } from '../../types';

const Cart = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartData } = useAppSelector((store) => store.cartReducer);
    const dispatch = useAppDispatch();

    const handleOpen = () => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
    };

    const removeCartItemsHandler = () => {
        dispatch(removeCartItems());
    };

    const removeCartItemHandler = (cartItemId: string) => {
        dispatch(removeCartItem(cartItemId));
    };

    const changeQuantityHandler = (cartItemId: string, quantity: number) => {
        dispatch(changeCartItemQuantity({ cartItemId, quantity }));
    };

    const findTotalAmound = (cartItems: ICart[]) => {
        const totalAmound = cartItems.reduce((acc: number, currItem: ICart) => {
            acc += currItem?.itemId.price * currItem.quantity;
            return acc;
        }, 0);
        return totalAmound;
    };

    return (
        <div className="flex flex-col max-w-7xl mx-auto my-10">
            <div className="flex justify-end">
                <Button onClick={removeCartItemsHandler} variant="text">
                    Clear all
                </Button>
            </div>
            <TableCart
                cartItems={cartData}
                removeCartItemHandler={removeCartItemHandler}
                changeQuantityHandler={changeQuantityHandler}
            />
            <div className="mt-3 flex flex-row justify-end">
                <div className="mt-3 flex flex-col items-end gap-5">
                    <div>
                        <Typography className="font-extrabold text-xl">Total: </Typography>{' '}
                        <Typography className="text-xl">₹{findTotalAmound(cartData)}</Typography>
                    </div>
                    <Button className="h-10" color="warning" variant="contained" onClick={handleOpen}>
                        Proceed to checkout
                    </Button>
                </div>
                {isOpen && <CheckoutReviewModal isOpen={isOpen} handleClose={handleClose} />}
            </div>
        </div>
    );
};

export default Cart;
