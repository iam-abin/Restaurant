import jwt from 'jsonwebtoken';
import { appConfig } from '../config/app.config';
import { IJwtPayload } from '../types';

/**
 * Creates a JWT access token.
 * @param payload - The payload to include in the token.
 * @returns {string} - The signed access token.
 */
export const createJwtAccessToken = (payload: IJwtPayload): string => {
    return createJwtToken(payload, appConfig.JWT_ACCESS_SECRET as string, appConfig.JWT_ACCESS_EXPIRY_TIME);
};

/**
 * Creates a JWT refresh token.
 * @param payload - The payload to include in the token.
 * @returns {string} - The signed refresh token.
 */
export const createJwtRefreshToken = (payload: IJwtPayload): string => {
    return createJwtToken(payload, appConfig.JWT_REFRESH_SECRET as string, appConfig.JWT_REFRESH_EXPIRY_TIME);
};

/**
 * Helper function to create a JWT token (access or refresh).
 * @param payload - The payload to include in the token.
 * @param secret - The secret to sign the token.
 * @param expiry - The expiry time for the token.
 * @returns {string} - The signed JWT token.
 */
const createJwtToken = (payload: IJwtPayload, secret: string, expiry: string): string => {
    return jwt.sign(payload, secret, { expiresIn: expiry });
};

/**
 * Verifies and decodes a JWT access token.
 * @param token - The access token to verify.
 * @returns {IJwtPayload} - The decoded JWT payload.
 */
export const verifyJwtAccessToken = (token: string): IJwtPayload => {
    const decodedData = jwt.verify(token, appConfig.JWT_ACCESS_SECRET!) as IJwtPayload;
    return decodedData;
};

/**
 * Verifies and decodes a JWT refresh token.
 * @param token - The refresh token to verify.
 * @returns {IJwtPayload} - The decoded JWT payload.
 */
export const verifyJwtRefreshToken = (token: string): IJwtPayload => {
    const decodedData = jwt.verify(token, appConfig.JWT_REFRESH_SECRET!) as IJwtPayload;
    return decodedData;
};
