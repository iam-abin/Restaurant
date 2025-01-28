import { z } from 'zod';

export const profileFromSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 character long'),
    city: z.string().min(1, 'City is required').max(50, 'City must be less than 50 character long'),
    country: z.string().min(1, 'Country is required').max(50, 'Country must be less than 50 character long'),
    address: z.string().min(1, 'Address is required').max(50, 'Address must be less than 50 character long'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    image: z.string().url({ message: 'Image must be a valid URL' }).optional(),
});

export type ProfileFormSchema = z.infer<typeof profileFromSchema>;
