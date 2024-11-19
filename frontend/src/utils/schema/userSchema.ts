import { z } from 'zod'

export const signUpSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z
        .number()
        .int('Phone number must be an integer') // Ensures it's a whole number
        .min(1000000000, 'Phone number must be exactly 10 digits') // Minimum value for 10 digits
        .max(9999999999, 'Phone number must be exactly 10 digits'),
    password: z.string().min(4, 'Password must be at least 4 characters long')
})

export const signInSchema = z.object({
    email: z.string().email('invalid email address'),
    password: z.string().min(4, 'password must be minimum 4 letters')
})

export const emailSchema = z.object({
    email: z.string().email('invalid email address')
})

export const resetPasswordSchema = z
    .object({
        password: z.string().min(4, 'Password must be at least 4 characters long'),
        confirmPassword: z.string().min(4, 'Password must be at least 4 characters long')
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'] // Specify which field to highlight on error
    })
