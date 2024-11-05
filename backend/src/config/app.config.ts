interface IAppConfig {
    PORT: number;
    DB_NAME: string;
    MONGO_URI: string;
    NODE_ENVIRONMENT: string;
    API_PREFIX: string;
    JWT_SECRET: string | undefined;
    JWT_EXPIRY_TIME: string;

    EMAIL_USER: string | undefined;
    EMAIL_PASSWORD: string | undefined;
}

const appConfig: Readonly<IAppConfig> = Object.freeze({
    PORT: +process.env.PORT! || 4000,
    DB_NAME: process.env.DB_NAME as string,
    MONGO_URI: process.env.MONGODB_CONNECTION_STRING as string,
    NODE_ENVIRONMENT: process.env.NODE_ENV as string,
    API_PREFIX: '/api',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY_TIME: '1h',

    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
});

export { appConfig };
