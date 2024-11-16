import crypto from 'crypto';

export const createToken = (): string => {
    const token = crypto.randomBytes(40).toString('hex');
    return token; // token string length will be 80
};
