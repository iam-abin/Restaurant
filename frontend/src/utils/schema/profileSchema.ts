import { z } from 'zod';

export const profileFromSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 character long'),
    city: z.string().min(1, 'City is required').max(50, 'City must be less than 50 character long'),
    country: z.string().min(1, 'Country is required').max(50, 'Country must be less than 50 character long'),
    address: z.string().min(1, 'Address is required').max(50, 'Address must be less than 50 character long'),
    image: z.string().url({ message: 'Image must be a valid URL' }).optional(), // Make image optional
    // image: z
    //     .instanceof(File)
    //     .optional()
    //     .refine((file) => file?.size !== 0, {
    //         message: 'Image file is required',
    //     }),
});

export type ProfileFormSchema = z.infer<typeof profileFromSchema>;
