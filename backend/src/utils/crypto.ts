import crypto from 'crypto';

/**
 * Creates a cryptographically secure random token of a specified length.
 * @param length - The length of the token to generate (default is 40 bytes).
 * @returns {string} - The generated token string.
 */
export const createToken = (length: number = 40): string => {
    const token = crypto.randomBytes(length).toString('hex');
    return token; // token length will be `length * 2` because each byte is represented as two hex characters.
};
