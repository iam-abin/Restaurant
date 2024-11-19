import { Typography } from '@mui/material'
import DropDown from '../../components/list/DropDown'

const Orders = () => {
    const statusList = ['Pending', 'Confirmed', 'Preparing', 'OutForDelivery', 'Delivered']

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Orders overview</h1>
            <div className="space-y-8">
                {/* Restaurant orders display here */}
                <div className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-200">
                    <div className="flex-1 mb-6 sm:mb-0">
                        <h1 className="text-xl font-semibold text-gray-800">Lorem ipsm</h1>
                        <p className="text-gray-600 mt-2">
                            <Typography className="font-semibold">Address: </Typography>
                            {'kochi, kerala'}
                        </p>
                        <p className="text-gray-600  mt-2">
                            <Typography className="font-semibold">Total Amount: </Typography>
                            {1000 / 100}
                        </p>
                    </div>
                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray300 mb-2">
                            Order Status
                        </label>
                        <DropDown statusList={statusList} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders
