import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import TableCart from '../components/table/TableCart'
import CheckoutReviewModal from '../components/modal/CheckoutReviewModal'

const Cart = () => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }
    return (
        <div className="flex flex-col max-w-7xl mx-auto my-10">
            <div className="flex justify-end">
                <Button variant="text">Clear all</Button>
            </div>
            <TableCart />
            <div className="mt-3 flex flex-row justify-end">
                <div className="mt-3 flex flex-col items-end gap-5">
                    <div>
                        <Typography className="font-extrabold text-xl">Total: </Typography>{' '}
                        <Typography className="text-xl">₹1000</Typography>
                    </div>
                    <Button
                        className="h-10"
                        color="warning"
                        variant="contained"
                        onClick={handleOpen}
                    >
                        Proceed to checkout
                    </Button>
                </div>
                {isOpen && <CheckoutReviewModal isOpen={isOpen} handleClose={handleClose} />}
            </div>
        </div>
    )
}

export default Cart
