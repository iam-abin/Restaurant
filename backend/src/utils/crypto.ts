import crypto from 'crypto';

/**
 * Generates a cryptographically secure random token.
 *
 * @param {number} [length=40] - The length of the token in bytes (will be doubled when returned as a hex string)
 * @param {BufferEncoding} [encoding='hex'] - The encoding to use for the final token string
 * @throws {TypeError} If length is not a positive integer
 * @returns {string} The generated token string
 */
export const createToken = (length: number = 40, encoding: BufferEncoding = 'hex'): string => {
    if (!Number.isInteger(length) || length <= 0) {
        throw new TypeError('Length must be a positive integer');
    }

    const token: Buffer = crypto.randomBytes(length);
    return token.toString(encoding);
};
