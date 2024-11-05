import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

const rateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        code: 429,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

export { rateLimiter };
