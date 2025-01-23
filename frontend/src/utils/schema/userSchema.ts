import { z } from 'zod';

// Reusable validations
const emailValidation = z
    .string()
    .email('Invalid email address')
    .max(50, 'Email must be less than 50 character long');
const passwordValidation = z
    .string()
    .min(4, 'Password must be at least 4 characters long')
    .max(50, 'Password must be less than 50 character long');

export const signUpSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 character long'),
    email: emailValidation,
    phone: z
        .number()
        .int('Phone number must be an integer') // Ensures it's a whole number
        .min(1000000000, 'Phone number must be exactly 10 digits') // Minimum value for 10 digits
        .max(9999999999, 'Phone number must be exactly 10 digits'),
    password: passwordValidation,
});

export const signInSchema = z.object({
    email: emailValidation,
    password: z.string().min(1, 'Password is required'),
});

export const emailSchema = z.object({
    email: emailValidation,
});

export const resetPasswordSchema = z
    .object({
        password: passwordValidation,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'], // Specify which field to highlight on error
    });
