export type CustomCookieOptions = {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge?: number;
};

export type Environment = 'development' | 'test' | 'staging' | 'production';
