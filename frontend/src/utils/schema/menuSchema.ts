import { z } from 'zod';

export const menuSchema = z.object({
    name: z.string().min(1, { message: 'name is required' }),
    description: z.string().min(1, { message: 'description is required' }),
    cuisine: z.string().min(1, { message: 'cuisine is required' }),
    price: z.number().min(0, { message: 'price can not be negative' }),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => file?.size !== 0, {
            message: 'Image file is required',
        }),
});
export type MenuFormSchema = z.infer<typeof menuSchema>;
