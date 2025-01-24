import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    changeCartItemQuantity,
    removeCartItem,
    removeCartItems,
    fetchCartItems,
} from '../../redux/thunk/cartThunk';
import { ICart, IUser, UserRole } from '../../types';
import CheckoutReviewModal from '../../components/modal/CheckoutReviewModal';
import CartEmptyGif from '../../assets/cart/cart-is-empty.jpeg';

import { useConfirmationContext } from '../../context/confirmationContext';
import { checkRole } from '../../utils';
import CustomButton from '../../components/Button/CustomButton';
import Table from '../../components/table/Table';
import { IconButton, Typography } from '@mui/material';
import { DEFAULT_LIMIT_VALUE } from '../../constants';

const Cart: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const { cartData } = useAppSelector((store) => store.cartReducer);
    const dispatch = useAppDispatch();
    const { restaurantId } = useParams();
    const { showConfirmation } = useConfirmationContext();
    const authData: IUser | null = useAppSelector((state) => state.authReducer.authData);
    const [numberOfPages, setNumberOfPages] = useState<number>(1);
    const DEFAULT_CURRENT_PAGE: number = 1;

    useEffect(() => {
        fetchAllCartItems(DEFAULT_CURRENT_PAGE);
    }, []);

    const fetchAllCartItems = async (currentPage: number): Promise<void> => {
        if (checkRole(UserRole.USER, authData?.role)) {
            await dispatch(
                fetchCartItems({
                    restaurantId: restaurantId!,
                    setTotalNumberOfPages: setNumberOfPages,
                    currentPage,
                    limit: DEFAULT_LIMIT_VALUE,
                }),
            );
        }
    };

    // Modal control
    const handleModalOpen = (): void => {
        setModalOpen(true);
    };
    const handleModalClose = (): void => {
        setModalOpen(false);
    };

    // Remove cart Items
    const handleremoveCartItemsButton = (): void => {
        showConfirmation({
            title: 'Do you want to remove all the cart items',
            description: 'Are you sure?',
            onAgree: () => removeCartItemsHandler(),
            closeText: 'No',
            okayText: 'Yes remove all',
        });
    };

    const removeCartItemsHandler = (): void => {
        dispatch(removeCartItems());
    };

    // Remove cart item
    const handleRemoveCartItemButton = (cartItemId: string): void => {
        showConfirmation({
            title: 'Do you want to remove this cart item',
            description: 'Are you sure?',
            onAgree: () => removeCartItemHandler(cartItemId),
            closeText: 'No',
            okayText: 'Yes remove',
        });
    };
    const removeCartItemHandler = async (cartItemId: string): Promise<void> => {
        await dispatch(removeCartItem(cartItemId));
        // Re-fetch the updated cart items
        fetchAllCartItems(DEFAULT_CURRENT_PAGE);
    };

    // Cart item quantity
    const handleQuantityChange = (cartItem: ICart, quantityChange: number) => {
        const newQuantity = cartItem.quantity + quantityChange;
        if (newQuantity < 1) return; // Ensure quantity doesn't go below 1
        changeQuantityHandler(cartItem._id, newQuantity); // Call the handler with the new quantity
    };

    const changeQuantityHandler = (cartItemId: string, quantity: number): void => {
        dispatch(changeCartItemQuantity({ cartItemId, quantity }));
    };

    const columns = [
        { Header: 'Name', accessor: 'itemId.name' },
        {
            Header: 'Price',
            button: (row: { itemId: { price: number; salePrice: number } }) => (
                <div className="flex items-center justify-center">
                    {row?.itemId?.salePrice || row?.itemId?.price}
                </div>
            ),
        },
        {
            Header: 'Quantity',
            button: (row: ICart) => (
                <div className="flex items-center justify-center">
                    <IconButton onClick={() => handleQuantityChange(row, -1)}>
                        <RemoveIcon />
                    </IconButton>
                    <Typography>{row?.quantity}</Typography>
                    <IconButton onClick={() => handleQuantityChange(row, 1)}>
                        <AddIcon />
                    </IconButton>
                </div>
            ),
        },
        {
            Header: 'Total',
            button: (row: {
                quantity: number;
                itemId: { quantity: number; price: number; salePrice: number };
            }) => (
                <div className="flex items-center justify-center">
                    {row.itemId.salePrice
                        ? row?.itemId?.salePrice * row?.quantity
                        : row?.itemId?.price * row?.quantity}
                </div>
            ),
        },
        {
            Header: 'Remove',
            button: (row: { _id: string }) => (
                <IconButton onClick={() => handleRemoveCartItemButton(row?._id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    // Total amoud calculator
    const findTotalAmount = (cartItems: ICart[]): number => {
        if (cartItems.length === 0) return 0; // Early return for empty arrays
        const totalAmount: number = cartItems.reduce((acc: number, currItem: ICart): number => {
            const effectivePrice: number = currItem.itemId.salePrice || currItem.itemId.price; // Use salePrice if available, otherwise price
            acc += effectivePrice * currItem.quantity;
            return acc;
        }, 0);
        return totalAmount;
    };

    return (
        <>
            {cartData.length > 0 ? (
                <div className="flex flex-col max-w-7xl mx-auto my-10">
                    <div>
                        <div className="flex justify-between items-center">
                            <h1 className="font-semibold text-5xl mt-4 mb-10">Cart items</h1>
                            <CustomButton
                                onClick={handleremoveCartItemsButton}
                                className="h-10"
                                variant="text"
                            >
                                Clear all
                            </CustomButton>
                        </div>
                    </div>
                    <Table
                        columns={columns}
                        data={cartData}
                        fetchData={fetchAllCartItems}
                        numberOfPages={numberOfPages}
                    />
                    <div className="mt-3 flex flex-row justify-end">
                        <div className="mt-3 flex flex-col items-end gap-5">
                            <div>
                                <span className="font-extrabold text-xl">Total: </span>{' '}
                                <span className="text-xl">₹{findTotalAmount(cartData)}</span>
                            </div>
                            <CustomButton className="h-10" onClick={handleModalOpen}>
                                Proceed to checkout
                            </CustomButton>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-cart flex justify-center h-screen w-full items-center ">
                    <img src={CartEmptyGif} alt="Empty Cart" className="empty-cart-gif w-3/4 md:w-1/4" />
                </div>
            )}

            {/* Checkout Modal */}
            {isModalOpen && <CheckoutReviewModal isOpen={isModalOpen} handleClose={handleModalClose} />}
        </>
    );
};

export default Cart;
