export interface IAppConfig {
    PORT: number;
    DB_NAME: string;
    MONGO_URI: string;
    NODE_ENVIRONMENT: string;
    API_PREFIX: string;
    JWT_SECRET: string;
    JWT_EXPIRY_TIME: string;

    FRONTEND_URL: string;

    EMAIL_USER: string;
    EMAIL_PASSWORD: string;

    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;

    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_ENDPOINT_SECRET: string;

    PAYMENT_SUCCESS_URL: string;
    PAYMENT_CANCEL_URL: string;
}

const appConfig: Readonly<IAppConfig> = Object.freeze({
    PORT: +process.env.PORT! || 4000,
    DB_NAME: process.env.DB_NAME!,
    MONGO_URI: process.env.MONGODB_CONNECTION_STRING!,
    NODE_ENVIRONMENT: process.env.NODE_ENV!,
    API_PREFIX: '/api/v1',
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRY_TIME: '3h',

    FRONTEND_URL: process.env.FRONTEND_URL!,

    EMAIL_USER: process.env.EMAIL_USER!,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY!,
    STRIPE_WEBHOOK_ENDPOINT_SECRET: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET!,

    PAYMENT_SUCCESS_URL: `${process.env.FRONTEND_URL}/order/status`,
    PAYMENT_CANCEL_URL: `${process.env.FRONTEND_URL}/cart`,
});

export { appConfig };
