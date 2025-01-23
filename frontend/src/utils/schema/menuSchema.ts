import { z } from 'zod';

export const menuSchema = z
    .object({
        name: z
            .string()
            .min(2, 'name must be atleast 2 charactors long')
            .max(50, 'name must be less than 50 character long'),
        description: z
            .string()
            .min(10, 'description must be atleast 10 charactors long')
            .max(200, { message: 'description must not exceed200 characters' }),
        cuisine: z
            .string()
            .min(2, 'cuisine must be atleast 2 charactors long')
            .max(50, 'cuisine must be less than 50 character long'),
        price: z.number().min(0, { message: 'price cannot be negative' }),
        salePrice: z.number().min(0, { message: 'sale price cannot be negative' }).optional(), // Marking salePrice as optional
        featured: z.boolean(),
        image: z
            .instanceof(File)
            .optional()
            .refine((file) => file?.size !== 0, {
                message: 'Image file is required',
            }),
    })
    .refine(
        (data) => data.salePrice === undefined || data.salePrice <= data.price, // Validate only if salePrice is provided
        {
            message: 'Sale price must be less than or equal to the original price',
            path: ['salePrice'], // Error is associated with salePrice field
        },
    );

export type MenuFormSchema = z.infer<typeof menuSchema>;
