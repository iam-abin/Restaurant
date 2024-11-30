import { Button } from '@mui/material';
import { RestaurantFormSchema, restaurantFromSchema } from '../../utils/schema/restaurantSchema';
import { FormEvent, useEffect, useState } from 'react';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { getMyRestaurantApi, updateRestaurantApi } from '../../api/apiMethods/restaurant';
import { hotToastMessage } from '../../utils/hotToast';
import { IResponse } from '../../types/api';
import { ICuisine, ICuisineResponse, IRestaurant, IRestaurantResponse } from '../../types';

const Restaurant = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [cuisines, setCuisines] = useState<ICuisineResponse[]>([]);

    const [input, setInput] = useState<RestaurantFormSchema>({
        name: restaurant?.ownerId.name ?? '',
        city: '',
        country: '',
        deliveryTime: 0,
        cuisines: [],
        image: undefined
    });
    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});

    useEffect(() => {
        (async () => {
            const response: IResponse = await getMyRestaurantApi();
            const { restaurant, cuisines } = response.data as IRestaurantResponse;
            setRestaurant(restaurant);
            // setCuisines({cuisines})
        })();
    }, []);

    useEffect(() => {
        if (restaurant) {
            setInput((prevInput) => ({
                ...prevInput,
                name: restaurant.ownerId.name || '',
                city: restaurant?.addressId?.city || '',
                country: restaurant?.addressId?.country || '',
                deliveryTime: restaurant?.deliveryTime || 0,
                cuisines: cuisines.map((cuisine) => (cuisine.cuisineId as ICuisine).name) || []
            }));
        }
    }, [restaurant]);

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({
            ...input,
            [name]: type === 'number' ? Number(value) : value
        });
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        console.log('input is ', input);

        const result = restaurantFromSchema.safeParse({
            ...input,
            cuisines: input.cuisines
        });
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<RestaurantFormSchema>);
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', input.name);
            formData.append('city', input.city);
            formData.append('country', input.country);
            formData.append('deliveryTime', input.deliveryTime.toString());
            formData.append('cuisines', JSON.stringify(input.cuisines));

            if (input.image) {
                formData.append('image', input.image);
            }

            // Make your API call to update the restaurant here
            if (restaurant) {
                const response: IResponse = await updateRestaurantApi(formData);
                hotToastMessage(response.message, 'success');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                <h1 className="font-extrabold text-2xl mb-5">Update Restaurant</h1>
                <form onSubmit={submitHandler}>
                    <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                        {/* Restaurant Name */}
                        <div className="relative">
                            <label>restaurantName</label>
                            <input
                                className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                placeholder="Enter your restaurant name"
                                autoComplete="restaurant-name"
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm">{errors.name}</span>
                            )}
                        </div>

                        {/* City */}
                        <div className="relative">
                            <label>city</label>
                            <input
                                className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                type="text"
                                name="city"
                                value={input.city}
                                onChange={changeEventHandler}
                                placeholder="Enter your city"
                                autoComplete="city"
                            />
                            {errors.city && (
                                <span className="text-red-500 text-sm">{errors.city}</span>
                            )}
                        </div>

                        {/* Country */}
                        <div className="relative">
                            <label>country</label>
                            <input
                                className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                type="text"
                                name="country"
                                value={input.country}
                                onChange={changeEventHandler}
                                placeholder="Enter your country"
                                autoComplete="country"
                            />
                            {errors.country && (
                                <span className="text-red-500 text-sm">{errors.country}</span>
                            )}
                        </div>

                        {/* Delivery Time */}
                        <div className="relative">
                            <label>deliveryTime( In minutes )</label>
                            <input
                                className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                type="number"
                                name="deliveryTime"
                                value={input.deliveryTime}
                                onChange={changeEventHandler}
                                placeholder="Enter delivery time"
                                autoComplete="delivery-time"
                            />
                            {errors.deliveryTime && (
                                <span className="text-red-500 text-sm">{errors.deliveryTime}</span>
                            )}
                        </div>

                        {/* Cuisines */}
                        <div className="relative">
                            <label>cuisines</label>
                            <input
                                className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                type="text"
                                name="cuisines"
                                value={input.cuisines}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        cuisines: e.target.value.split(',').map((c) => c.trim()) // Split and trim for state
                                    })
                                }
                                placeholder="Enter cuisines (e.g. Momos, Biryani)"
                                autoComplete="cuisines"
                            />
                            {errors.cuisines && (
                                <span className="text-red-500 text-sm">{errors.cuisines}</span>
                            )}
                        </div>

                        {/* Upload Restaurant Banner */}
                        <div className="relative">
                            <label>Upload Restaurant Banner</label>
                            <input
                                className="w-full h-10 boh-12der border-black rounded-lg p-1 pl-4"
                                type="file"
                                accept="image/*"
                                name="image"
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        image: e.target.files?.[0] || undefined
                                    })
                                }
                            />
                            {errors.image && (
                                <span className="text-red-500 text-sm">
                                    {errors.image?.name || 'image file is required'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="my-5 w-fit">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mb-5 bg-orange-300"
                            variant="contained"
                        >
                            {isLoading ? (
                                <label className="flex items-center gap-4">
                                    Please wait <LoaderCircle />
                                </label>
                            ) : (
                                'Update Restaurant'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Restaurant;
