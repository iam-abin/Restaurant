import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    changeCartItemQuantity,
    removeCartItem,
    removeCartItems,
    fetchCartItems,
} from '../../redux/thunk/cartThunk';
import { ICart } from '../../types';
import TableCart from '../../components/table/TableCart';
import CheckoutReviewModal from '../../components/modal/CheckoutReviewModal';
import { ROLES_CONSTANTS } from '../../utils/constants';
import CartEmptyGif from '../../assets/cart-is-empty.jpeg';
import usePagination from '../../hooks/usePagination';
import PaginationButtons from '../../components/pagination/PaginationButtons';

const Cart = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartData } = useAppSelector((store) => store.cartReducer);
    const dispatch = useAppDispatch();
    const { restaurantId } = useParams();

    const authData = useAppSelector((state) => state.authReducer.authData);
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    useEffect(() => {
        if (authData?.role === ROLES_CONSTANTS.USER) {
            dispatch(fetchCartItems({ restaurantId: restaurantId!, setTotalNumberOfPages }));
        }
    }, []);

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

    const findTotalAmount = (cartItems: ICart[]) => {
        const totalAmount = cartItems.reduce((acc: number, currItem: ICart) => {
            acc += currItem?.itemId.price * currItem.quantity;
            return acc;
        }, 0);
        return totalAmount;
    };

    return (
        <>
            {cartData.length > 0 ? (
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
                                <span className="font-extrabold text-xl">Total: </span>{' '}
                                <span className="text-xl">₹{findTotalAmount(cartData)}</span>
                            </div>
                            <Button className="h-10" color="warning" variant="contained" onClick={handleOpen}>
                                Proceed to checkout
                            </Button>
                        </div>
                        {isOpen && <CheckoutReviewModal isOpen={isOpen} handleClose={handleClose} />}
                    </div>
                </div>
            ) : (
                <div className="empty-cart flex justify-center h-screen w-full items-center ">
                    <img src={CartEmptyGif} alt="Empty Cart" className="empty-cart-gif w-3/4 md:w-1/4" />
                </div>
            )}
            <div className="flex justify-center my-10">
                <PaginationButtons
                    handlePageChange={handlePageChange}
                    numberOfPages={totalNumberOfPages}
                    currentPage={currentPage}
                />
            </div>
        </>
    );
};

export default Cart;
