import { z } from 'zod';

export const menuSchema = z
    .object({
        name: z.string().min(1, { message: 'name is required' }),
        description: z.string().min(1, { message: 'description is required' }),
        price: z.number().min(0, { message: 'price cannot be negative' }),
        salePrice: z.number().min(0, { message: 'sale price cannot be negative' }).optional(), // Marking salePrice as optional
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
