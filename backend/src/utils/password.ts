import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt with a predefined salt round.
 * @param password - The plaintext password to be hashed.
 * @returns A promise resolving to the hashed password.
 */
export const generateHashedPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

/**
 * Compares a plaintext password with a hashed password.
 * @param password - The plaintext password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise resolving to true if the passwords match, false otherwise.
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};
