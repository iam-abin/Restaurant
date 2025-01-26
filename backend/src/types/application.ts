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
