import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    changeCartItemQuantity,
    removeCartItem,
    removeCartItems,
    fetchCartItems,
} from '../../redux/thunk/cartThunk';
import { ICart, IUser, UserRole } from '../../types';
import TableCart from '../../components/table/TableCart';
import CheckoutReviewModal from '../../components/modal/CheckoutReviewModal';
import CartEmptyGif from '../../assets/cart-is-empty.jpeg';
import usePagination from '../../hooks/usePagination';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import { useConfirmationContext } from '../../context/confirmationContext';
import { checkRole } from '../../utils';
import CustomButton from '../../components/Button/CustomButton';

const Cart: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartData } = useAppSelector((store) => store.cartReducer);
    const dispatch = useAppDispatch();
    const { restaurantId } = useParams();
    const { showConfirmation } = useConfirmationContext();

    const authData: IUser | null = useAppSelector((state) => state.authReducer.authData);
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    useEffect(() => {
        if (checkRole(UserRole.USER, authData?.role)) {
            dispatch(fetchCartItems({ restaurantId: restaurantId!, setTotalNumberOfPages }));
        }
    }, []);

    const handleOpen = (): void => {
        setIsOpen(true);
    };
    const handleClose = (): void => {
        setIsOpen(false);
    };

    const handleremoveCartItemsButton = (): void => {
        showConfirmation({
            title: 'Do you want to remove all the cart items',
            description: 'Are you sure?',
            onAgree: () => removeCartItemsHandler(),
            closeText: 'No',
            okayText: 'Yes remove all',
        });
    };

    const handleremoveCartItemButton = (cartItemId: string): void => {
        showConfirmation({
            title: 'Do you want to remove this cart item',
            description: 'Are you sure?',
            onAgree: () => removeCartItemHandler(cartItemId),
            closeText: 'No',
            okayText: 'Yes remove',
        });
    };

    const removeCartItemsHandler = (): void => {
        dispatch(removeCartItems());
    };

    const removeCartItemHandler = (cartItemId: string): void => {
        dispatch(removeCartItem(cartItemId));
    };

    const changeQuantityHandler = (cartItemId: string, quantity: number): void => {
        dispatch(changeCartItemQuantity({ cartItemId, quantity }));
    };

    const findTotalAmount = (cartItems: ICart[]): number => {
        const totalAmount = cartItems.reduce((acc: number, currItem: ICart): number => {
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
                        <CustomButton onClick={handleremoveCartItemsButton} variant="text">
                            Clear all
                        </CustomButton>
                    </div>
                    <TableCart
                        cartItems={cartData}
                        removeCartItemHandler={handleremoveCartItemButton}
                        changeQuantityHandler={changeQuantityHandler}
                    />
                    <div className="mt-3 flex flex-row justify-end">
                        <div className="mt-3 flex flex-col items-end gap-5">
                            <div>
                                <span className="font-extrabold text-xl">Total: </span>{' '}
                                <span className="text-xl">₹{findTotalAmount(cartData)}</span>
                            </div>
                            <CustomButton className="h-10" onClick={handleOpen}>
                                Proceed to checkout
                            </CustomButton>
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
