export interface IAppConfig {
    PORT: number;
    DB_NAME: string;
    MONGO_URI: string;
    NODE_ENVIRONMENT: NodeEnvironment;
    API_PREFIX: string;
    LOG_FILE_PATH: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRY_TIME: string;
    JWT_REFRESH_EXPIRY_TIME: string;

    COOKIE_JWT_ACCESS_EXPIRY_TIME: number;
    COOKIE_JWT_REFRESH_EXPIRY_TIME: number;

    FRONTEND_URLS: string[];

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

export type CustomCookieOptions = {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge?: number;
    domain?: string;
};

export enum NodeEnvironment {
    DEVELOPMENT = 'development',
    TEST = 'test',
    STAGING = 'staging',
    PRODUCTION = 'production',
}
