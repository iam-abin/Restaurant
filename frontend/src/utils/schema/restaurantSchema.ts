import { z } from 'zod';

export const restaurantFromSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 character long'),
    city: z.string().min(1, 'City is required').max(50, 'City must be less than 50 character long'),
    country: z.string().min(1, 'Country is required').max(50, 'Country must be less than 50 character long'),
    deliveryTime: z.number().min(0, { message: 'Delivery time can not be negative' }),
    // cuisines: z.array(z.string()),
    // cuisines:z.string(),
    // image: z
    // .string()
    // .url({ message: 'Image must be a valid URL' })
    // .optional(), // Make image optional
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => file?.size !== 0, {
            message: 'Image file is required',
        }),
});

export type RestaurantFormSchema = z.infer<typeof restaurantFromSchema>;
