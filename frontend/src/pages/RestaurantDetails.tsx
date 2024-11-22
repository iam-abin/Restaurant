import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import { Chip, Typography } from '@mui/material'
import MenuCardSkeleton from '../components/shimmer/MenuCardSkeleton'
import { useEffect, useState } from 'react'
import { getARestaurantApi } from '../api/apiMethods/restaurant'
import { useParams } from 'react-router-dom'
import { ICuisine, IMenu } from '../types'
import MenuCard from '../components/cards/MenuCard'
// import { IRestaurant } from '../types'

const RestaurantDetails = () => {
    const params = useParams()
    const [restaurant, setRestaurant] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            const response = await getARestaurantApi(params.restaurantId!)
            setRestaurant(response.data)
            setIsLoading(false)
        })()
    }, [])
    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="w-full">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img
                        src={restaurant?.imageUrl || 'Loading...'}
                        alt="res_image"
                        className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <div className="font-medium text-xl">{restaurant?.restaurant?.name}</div>
                        <div className="flex gap-2 my-2">
                            {restaurant?.cuisines?.map((cusine: ICuisine, index: number) => (
                                <div
                                    key={index}
                                    className="relative inline-flex items-center max-w-full"
                                >
                                    <Chip label={cusine.name} variant="outlined" />
                                </div>
                            ))}
                        </div>
                        <div className="flex md:flex-row flex-col gap-2 my-5">
                            <div className="flex items-center gap-2">
                                <TimerOutlinedIcon className="w-5 h-5" />
                                <h1 className="flex items-center gap-2 font-medium">
                                    Delivery Time:{' '}
                                    <Typography className="text-[#D19254]">
                                        {restaurant?.deliveryTime} mins
                                    </Typography>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:p-4">
                    <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
                    <div className="flex flex-wrap">
                        {isLoading ? (
                            <>
                                {' '}
                                <MenuCardSkeleton />
                                <MenuCardSkeleton />
                                <MenuCardSkeleton />
                            </>
                        ) : restaurant?.menus ? (
                            restaurant?.menus.map((menu: IMenu) => <MenuCard menu={menu} />)
                        ) : (
                            'No menus available'
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantDetails
