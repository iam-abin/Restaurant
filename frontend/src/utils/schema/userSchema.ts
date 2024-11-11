import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("invalid email address"),
    phone: z
        .string()
        .min(9, "number must be 10 characters")
        .max(9, "number must be 10 characters"),
    password: z.string().min(4, "password must be minimum 4 letters"),
});

export const signInSchema = z.object({
    email: z.string().email("invalid email address"),
    password: z.string().min(4, "password must be minimum 4 letters"),
});

export const emailSchema = z.object({
    email: z.string().email("invalid email address"),
});
