import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import RestaurantKfcImg from '../assets/restaurant_KFC.png'
import { Chip, Typography } from '@mui/material'
import MenuCard from '../components/cards/MenuCard'
import MenuCardSkeleton from '../components/shimmer/MenuCardSkeleton'

const RestaurantDetails = () => {
    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="w-full">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img
                        src={RestaurantKfcImg || 'Loading...'}
                        alt="res_image"
                        className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <div className="font-medium text-xl"> KFC store</div>
                        <div className="flex gap-2 my-2">
                            {['biriyani', 'shawarma', 'Kuzhi mandhi'].map((cusine, index) => (
                                <div
                                    key={index}
                                    className="relative inline-flex items-center max-w-full"
                                >
                                    <Chip label={cusine} variant="outlined" />
                                </div>
                            ))}
                        </div>
                        <div className="flex md:flex-row flex-col gap-2 my-5">
                            <div className="flex items-center gap-2">
                                <TimerOutlinedIcon className="w-5 h-5" />
                                <h1 className="flex items-center gap-2 font-medium">
                                    Delivery Time:{' '}
                                    <Typography className="text-[#D19254]">{35} mins</Typography>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:p-4">
                    <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
                    <div className="grid md:grid-cols-3 space-y-4">
                        <MenuCard />
                        <MenuCard />
                        <MenuCard />
                        <MenuCardSkeleton />
                        <MenuCardSkeleton />
                        <MenuCardSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantDetails
