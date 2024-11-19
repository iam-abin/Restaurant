import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Success = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50px-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Order Status:{' '}
                        <Typography className="text-[#FF5A5A]">
                            {'confirm'.toUpperCase()}
                        </Typography>
                    </h1>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Order Summary
                    </h2>
                </div>
                <Link to="/cart">
                    <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Success
