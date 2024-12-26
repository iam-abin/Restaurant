import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.config';
import { IJwtPayload } from '../types';

export const createJwtAccessToken = (payload: IJwtPayload): string => {
    const accessToken: string = jwt.sign(payload, appConfig.JWT_ACCESS_SECRET as string, {
        expiresIn: appConfig.JWT_ACCESS_EXPIRY_TIME,
    });
    return accessToken;
};

export const createJwtRefreshToken = (payload: IJwtPayload): string => {
    const refreshToken: string = jwt.sign(payload, appConfig.JWT_REFRESH_SECRET as string, {
        expiresIn: appConfig.JWT_REFRESH_EXPIRY_TIME,
    });
    return refreshToken;
};

export const verifyJwtAccessToken = (token: string): IJwtPayload => {
    const decodedData = jwt.verify(token, appConfig.JWT_ACCESS_SECRET!) as IJwtPayload;
    return decodedData;
};

export const verifyJwtRefreshToken = (token: string): IJwtPayload => {
    const decodedData = jwt.verify(token, appConfig.JWT_REFRESH_SECRET!) as IJwtPayload;
    return decodedData;
};
