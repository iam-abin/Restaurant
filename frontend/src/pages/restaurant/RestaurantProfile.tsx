import { FormEvent, useEffect, useState } from 'react';
import { Alert, Chip } from '@mui/material';

import { checkFileType, hotToastMessage, RestaurantFormSchema, restaurantFromSchema } from '../../utils';
import { updateRestaurantApi } from '../../api/apiMethods';
import { IResponse, ICuisineResponse, IRestaurant, IRestaurantResponse, IUser } from '../../types';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMyRestaurant } from '../../redux/thunk/restaurantThunk';
import { useConfirmationContext } from '../../context/confirmationContext';
import CustomButton from '../../components/Button/CustomButton';

const RestaurantProfile: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [cuisines, setCuisines] = useState<ICuisineResponse[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
    const dispatch = useAppDispatch();
    const { showConfirmation } = useConfirmationContext();

    const restaurantData: IRestaurantResponse | null = useAppSelector(
        (state) => state.restaurantReducer.restaurantData,
    );

    const [input, setInput] = useState<RestaurantFormSchema>({
        name: restaurant?.ownerId.name ?? '',
        city: '',
        country: '',
        deliveryTime: 0,
        phone: '',
        image: undefined,
    });
    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});

    useEffect(() => {
        (async () => {
            await dispatch(fetchMyRestaurant());
        })();
    }, []);

    useEffect(() => {
        if (restaurant) {
            setInput((prevInput) => ({
                ...prevInput,
                name: restaurant.ownerId.name || '',
                city: restaurant?.addressId?.city || '',
                country: restaurant?.addressId?.country || '',
                deliveryTime: restaurant?.deliveryTime,
                phone: (restaurant?.ownerId as IUser).phone,
            }));
        }
    }, [restaurant]);

    useEffect(() => {
        if (restaurantData) {
            const { restaurant, cuisines } = restaurantData as IRestaurantResponse;
            setRestaurant(restaurant);
            setCuisines(cuisines);
            setSelectedImage(restaurant.imageUrl);
        }
    }, [restaurantData]);

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type } = e.target;
        setInput({
            ...input,
            [name]: type === 'number' ? Number(value) : value,
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file: File | undefined = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const requiredFileType: string = 'image';
        const isValid: boolean = checkFileType(file, requiredFileType);
        if (!isValid) {
            hotToastMessage(`Please select a valid ${requiredFileType} file.`, 'error');
            return;
        }

        setInput((prevInput) => ({
            ...prevInput,
            image: file,
        }));
        setSelectedImage(file);
    };

    const getImagePreviewUrl = (): string | undefined => {
        if (!selectedImage && !restaurant?.imageUrl) return undefined;

        // Return the selected image's preview URL if it is a File
        if (selectedImage instanceof File) {
            return URL.createObjectURL(selectedImage);
        }

        // Otherwise, return the existing image URL from the restaurant
        return restaurant?.imageUrl;
    };

    useEffect(() => {
        if (!selectedImage || input.image === undefined) {
            setSelectedImage(null);
        }
    }, [input.image]);

    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(getImagePreviewUrl()!);
            }
        };
    }, [selectedImage]);

    const handleUpdateProfileButton = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        showConfirmation({
            title: 'Do you want to update restaurant profile',
            description: 'Are you sure?',
            onAgree: () => udateProfileSubmitHandler(),
            closeText: 'No',
            okayText: 'Yes',
        });
    };

    const udateProfileSubmitHandler = async (): Promise<void> => {
        setErrors({});
        setIsLoading(true);
        const result = restaurantFromSchema.safeParse({
            ...input,
            ['phone']: input['phone'].toString(),
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
            formData.append('phone', input.phone);

            if (input.image) {
                formData.append('image', input.image);
            }

            // Make your API call to update the restaurant here
            if (restaurant) {
                const response: IResponse = await updateRestaurantApi(formData);
                hotToastMessage(response.message, 'success');
            }
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const isProfileIncomplete: boolean =
        !input.name || !input.city || !input.country || !input.phone || input.deliveryTime <= 0;

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                {/* Warning message */}
                {isProfileIncomplete && (
                    <Alert severity="warning" className="mb-4">
                        Fill all the profile details if {input.name ? input.name : 'this'} restaurant want to
                        be available in the search list.
                    </Alert>
                )}
                <h1 className="font-extrabold text-2xl mb-5">Update Restaurant</h1>
                <form onSubmit={handleUpdateProfileButton} className="md:grid md:grid-cols-3 md:gap-6">
                    {/* Left Side Form Inputs */}
                    <div className="md:col-span-2 space-y-4">
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
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
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
                                {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
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
                                <label>deliveryTime (In minutes)</label>
                                <input
                                    className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                    type="number"
                                    name="deliveryTime"
                                    value={input.deliveryTime}
                                    onChange={changeEventHandler}
                                    placeholder="Enter delivery time"
                                    autoComplete="delivery-time"
                                    max={300}
                                />
                                {errors.deliveryTime && (
                                    <span className="text-red-500 text-sm">{errors.deliveryTime}</span>
                                )}
                            </div>
                            {/* {Phone} */}
                            <div className="relative">
                                <label>phone</label>
                                <input
                                    className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                    type="number"
                                    name="phone"
                                    value={input.phone}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your phone"
                                    autoComplete="phone"
                                />
                                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                            </div>
                        </div>

                        {/* Cuisines */}
                        <div className="flex flex-wrap gap-2">
                            {cuisines &&
                                cuisines.map((cuisine, index) => (
                                    <Chip
                                        label={cuisine.cuisineId.name}
                                        key={index}
                                        className="w-24"
                                        variant="outlined"
                                    />
                                ))}
                        </div>
                    </div>

                    {/* Right Side Image Preview */}
                    <div className="md:col-span-1 pt-6 md:pt-1">
                        {selectedImage && (
                            <div className="flex justify-center items-center md:justify-end">
                                <img
                                    src={getImagePreviewUrl()}
                                    alt="Selected image preview"
                                    className="max-w-full h-auto max-h-96 object-contain border border-gray-300 rounded-lg"
                                />
                            </div>
                        )}

                        {/* Upload Restaurant Banner */}
                        <div className="relative">
                            <label>Upload Restaurant Banner</label>

                            <CustomButton
                                variant="contained"
                                className="w-full"
                                sx={{ background: '#059dc0' }}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                Choose image
                                <input
                                    type="file"
                                    id="fileInput"
                                    hidden
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </CustomButton>
                            {errors.image && (
                                <span className="text-red-500 text-sm">
                                    {errors.image?.name || 'image file is required'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="my-5 w-fit">
                        <CustomButton type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <label className="flex items-center gap-4">
                                    Please wait <LoaderCircle />
                                </label>
                            ) : (
                                'Update Restaurant'
                            )}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestaurantProfile;
