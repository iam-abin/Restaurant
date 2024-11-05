interface IAppConfig {
    PORT: string | number;
    MONGO_URI: string;
    NODE_ENVIRONMENT: string;
    API_PREFIX: string;
}

const appConfig: Readonly<IAppConfig> = Object.freeze({
    PORT: process.env.PORT || 4000,
    MONGO_URI: process.env.MONGODB_CONNECTION_STRING as string,
    NODE_ENVIRONMENT: process.env.NODE_ENV as string,
    API_PREFIX: '/api',

});

export { appConfig };