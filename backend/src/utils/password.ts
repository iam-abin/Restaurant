import bcrypt from 'bcryptjs';

type PasswordType = 'password' | 'hashed password' | undefined;

/**
 * Validates a password or stored password.
 * @param {string} password - The password to validate.
 * @param {string} passwordType - Type of password ('password' or 'hashed password').
 * @throws {Error} If the password is invalid.
 */
const validatePassword = (password: string, passwordType?: PasswordType): void => {
    if (!password || typeof password !== 'string') {
        throw new TypeError(`${passwordType ?? 'password'} must be a non-empty string`);
    }
};

/**
 * Hashes a password using bcrypt with a predefined salt round.
 * @param {string} password - The plaintext password to be hashed.
 * @returns A promise resolving to the hashed password.
 */
export const generateHashedPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
    validatePassword(password);
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plaintext password with a hashed password.
 * @param {string} password - The plaintext password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns A promise resolving to true if the passwords match, false otherwise.
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    validatePassword(password);
    validatePassword(hashedPassword, 'hashed password');
    return await bcrypt.compare(password, hashedPassword);
};
