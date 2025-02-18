import { createToken } from '../../src/utils';

describe('createToken', () => {
    test('should generate a token of expected length (hex encoding)', () => {
        const length = 20; // 20 bytes = 40 hex characters
        const token = createToken(length, 'hex');
        expect(token.length).toBe(length * 2); // Hex encoding doubles the length
    });

    test('should throw an error if length is not a positive integer', () => {
        expect(() => createToken(-5)).toThrow(TypeError);
        expect(() => createToken(0)).toThrow(TypeError);
        expect(() => createToken(3.5)).toThrow(TypeError);
        expect(() => createToken(NaN)).toThrow(TypeError);
    });

    test('should throw an error if encoding is invalid', () => {
        expect(() => createToken(20, 'invalidEncoding' as BufferEncoding)).toThrow();
    });

    test('should generate different tokens on different calls', () => {
        const token1 = createToken(20);
        const token2 = createToken(20);
        expect(token1).not.toBe(token2);
    });
});
