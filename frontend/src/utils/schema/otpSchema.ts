import { z } from 'zod';

export const otpSchema = z.object({
    otp: z.string().min(6, 'Otp length must be 6').max(6, 'Otp length must be 6'),
});
