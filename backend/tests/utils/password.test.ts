import bcrypt from 'bcryptjs';
import { comparePassword, generateHashedPassword } from '../../src/utils';

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('Password Utilities', () => {
    const plaintextPassword = 'SecurePass123!';
    const hashedPassword = '$2a$10$abcdefghijABCDEFGHIJ1234567890ABCDEFGHIJ1234567890ABCDEFGHIJ12';

    describe('generateHashedPassword', () => {
        it('should hash a valid password', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

            const result = await generateHashedPassword(plaintextPassword);

            expect(bcrypt.hash).toHaveBeenCalledWith(plaintextPassword, 10);
            expect(result).toBe(hashedPassword);
        });

        it('should throw an error if password is empty', async () => {
            await expect(generateHashedPassword('')).rejects.toThrow('password must be a non-empty string');
        });

        it('should throw an error if password is not a string', async () => {
            await expect(generateHashedPassword(null as unknown as string)).rejects.toThrow(
                'password must be a non-empty string',
            );
        });
    });

    describe('comparePassword', () => {
        it('should return true for matching passwords', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await comparePassword(plaintextPassword, hashedPassword);

            expect(bcrypt.compare).toHaveBeenCalledWith(plaintextPassword, hashedPassword);
            expect(result).toBe(true);
        });

        it('should return false for non-matching passwords', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await comparePassword(plaintextPassword, hashedPassword);

            expect(bcrypt.compare).toHaveBeenCalledWith(plaintextPassword, hashedPassword);
            expect(result).toBe(false);
        });

        it('should throw an error if password is empty', async () => {
            await expect(comparePassword('', hashedPassword)).rejects.toThrow(
                'password must be a non-empty string',
            );
        });

        it('should throw an error if hashed password is empty', async () => {
            await expect(comparePassword(plaintextPassword, '')).rejects.toThrow(
                'hashed password must be a non-empty string',
            );
        });
    });
});
