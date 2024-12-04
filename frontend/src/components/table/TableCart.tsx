import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import { ICart } from '../../types';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein, quantity: 1 };
}

const initialRows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function TableCart({
    cartItems,
    removeCartItemHandler,
    changeQuantityHandler,
}: {
    cartItems: ICart[];
    removeCartItemHandler: (cartItemId: string) => void;
    changeQuantityHandler: (cartItemId: string, quantity: number) => void;
}) {
    const [rows, setRows] = React.useState(initialRows);

    const handleQuantityChange = (cartItem: any, quantityChange: number) => {
        const newQuantity = cartItem.quantity + quantityChange;
        if (newQuantity < 1) return; // Ensure quantity doesn't go below 1
        changeQuantityHandler(cartItem._id, newQuantity); // Call the handler with the new quantity
    };

    const handleRemoveItem = (cartItemId: string) => {
        removeCartItemHandler(cartItemId);
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Item</StyledTableCell>
                        <StyledTableCell align="center">Price</StyledTableCell>
                        <StyledTableCell align="center">Quantity</StyledTableCell>
                        <StyledTableCell align="center">Total</StyledTableCell>
                        <StyledTableCell align="center">Remove</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cartItems.map((cartItem: ICart) => (
                        <StyledTableRow key={cartItem._id}>
                            <StyledTableCell component="th" scope="cartItem">
                                {cartItem.itemId.name}
                            </StyledTableCell>
                            <StyledTableCell align="center">{cartItem.itemId.price}</StyledTableCell>
                            <StyledTableCell align="center">
                                <div className="flex items-center justify-center">
                                    <IconButton onClick={() => handleQuantityChange(cartItem, -1)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography>{cartItem.quantity}</Typography>
                                    <IconButton onClick={() => handleQuantityChange(cartItem, 1)}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                {cartItem.itemId.price * cartItem.quantity}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <IconButton onClick={() => handleRemoveItem(cartItem._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
