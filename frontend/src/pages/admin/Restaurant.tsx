import { Button, FormHelperText } from "@mui/material";
import {
    RestaurantFormSchema,
    restaurantFromSchema,
} from "../../utils/schema/restaurantSchema";
import { FormEvent, useState } from "react";
import LoaderCircle from "../../components/LoaderCircle";

const Restaurant = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [input, setInput] = useState<RestaurantFormSchema>({
        restaurantName: "",
        city: "",
        country: "",
        deliveryTime: 0,
        cuisines: [],
        imageFile: undefined,
    });
    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({
            ...input,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = restaurantFromSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<RestaurantFormSchema>);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("restaurantName", input.restaurantName);
            formData.append("city", input.city);
            formData.append("country", input.country);
            formData.append("deliveryTime", input.deliveryTime.toString());
            formData.append("cuisines", JSON.stringify(input.cuisines));

            if (input.imageFile) {
                formData.append("imageFile", input.imageFile);
            }

            // Make your API call to update or create the restaurant here
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                <h1 className="font-extrabold text-2xl mb-5">
                    Update Restaurant
                </h1>
                <form onSubmit={submitHandler}>
                    <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                        {/* Restaurant Name */}
                        <div className="relative">
                        <label>restaurantName</label>
                            <input
                                className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                type="text"
                                name="restaurantName"
                                value={input.restaurantName}
                                onChange={changeEventHandler}
                                placeholder="Enter your restaurant name"
                                autoComplete="restaurant-name"
                            />
                            {errors.restaurantName && (
                                <FormHelperText className="text-red-500 text-sm">
                                    {errors.restaurantName}
                                </FormHelperText>
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
                                <FormHelperText className="text-red-500 text-sm">
                                    {errors.city}
                                </FormHelperText>
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
                                <FormHelperText className="text-red-500 text-sm">
                                    {errors.country}
                                </FormHelperText>
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
                                <FormHelperText className="text-red-500 text-sm">
                                    {errors.deliveryTime}
                                </FormHelperText>
                            )}
                        </div>

                        {/* Cuisines */}
                        <div className="relative">
                        <label>cuisines</label>
                            <input
                                className="w-full h-12 border border-black rounded-lg p-1 pl-4"
                                type="text"
                                name="cuisines"
                                value={input.cuisines.join(", ")}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        cuisines: e.target.value.split(","),
                                    })
                                }
                                placeholder="Enter cuisines (e.g. Momos, Biryani)"
                                autoComplete="cuisines"
                            />
                            {errors.cuisines && (
                                <FormHelperText className="text-red-500 text-sm">
                                    {errors.cuisines}
                                </FormHelperText>
                            )}
                        </div>

                        {/* Upload Restaurant Banner */}
                        <div className="relative">
                        <label>Upload Restaurant Banner</label>
                            <input
                                className="w-full h-10 boh-12der border-black rounded-lg p-1 pl-4"
                                type="file"
                                accept="image/*"
                                name="imageFile"
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        imageFile: e.target.files?.[0] || undefined,
                                    })
                                }
                            />
                            {errors.imageFile && (
                                <FormHelperText className="text-red-500 text-sm">
                                    {errors.imageFile?.name || "image file is required"}
                                </FormHelperText>
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
                                "Update Restaurant"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Restaurant;
