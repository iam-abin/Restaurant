import { IAppConfig, NodeEnvironment } from '../../types';

const PORT: number = +process.env.PORT! || 3000;
const FRONTEND_URLS: string[] =
    process.env.FRONTEND_URLS?.split(',')
        .map((url: string) => url.trim())
        .filter(
            (url: string) =>
                url && url !== 'null' && url !== 'undefined' && url !== '' && url !== '[]' && url !== '{}',
        ) || [];

const DEFAULT_FRONTEND_URL: string = FRONTEND_URLS[0];

const appConfig: Readonly<IAppConfig> = Object.freeze({
    PORT,
    SERVER_URL: process.env.SERVER_URL! || `http://localhost:${PORT}`,
    DB_NAME: process.env.DB_NAME!,
    MONGO_URI: process.env.MONGODB_CONNECTION_STRING!,
    NODE_ENVIRONMENT: process.env.NODE_ENV as NodeEnvironment,
    API_PREFIX: '/api/v1',
    LOG_FILE_PATH: 'error.log',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_EXPIRY_TIME: '3h',
    JWT_REFRESH_EXPIRY_TIME: '7d',

    COOKIE_JWT_ACCESS_EXPIRY_TIME: 3 * 60 * 60 * 1000, // Convert hours to milliseconds (3 hour),
    COOKIE_JWT_REFRESH_EXPIRY_TIME: 7 * 24 * 60 * 60 * 1000, // Convert days to milliseconds (7 days)

    FRONTEND_URLS,

    EMAIL_USER: process.env.EMAIL_USER!,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY!,
    STRIPE_WEBHOOK_ENDPOINT_SECRET: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET!,

    PAYMENT_SUCCESS_URL: `${DEFAULT_FRONTEND_URL}/order/success`,
    PAYMENT_CANCEL_URL: `${DEFAULT_FRONTEND_URL}/cart`,
});

const optionalEnvVariables: string[] = ['PORT', 'FRONTEND_URLS', 'SERVER_URL'];

export { appConfig, optionalEnvVariables };
