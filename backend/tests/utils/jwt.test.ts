import jwt from 'jsonwebtoken';
import { IJwtPayload, UserRole } from '../../src/types';
import {
    createJwtAccessToken,
    createJwtRefreshToken,
    verifyJwtAccessToken,
    verifyJwtRefreshToken,
} from '../../src/utils';
import { appConfig } from '../../src/config/app-config';

jest.mock('jsonwebtoken');

describe('JWT Utility Functions', () => {
    const mockPayload: IJwtPayload = {
        userId: '123456',
        role: UserRole.USER,
    };

    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // eslint-disable-next-lint @typescript-eslint/no-explicit-any
    const invalidPayloads: unknown[] = [
        null,
        undefined,
        {},
        { userId: 123 }, // Invalid type
        { role: 'admin' }, // Missing userId
    ];

    describe('createJwtAccessToken', () => {
        it('should create a signed JWT access token', () => {
            (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);
            const token = createJwtAccessToken(mockPayload);

            expect(jwt.sign).toHaveBeenCalledWith(mockPayload, appConfig.JWT_ACCESS_SECRET, {
                expiresIn: appConfig.JWT_ACCESS_EXPIRY_TIME,
            });
            expect(token).toBe(mockAccessToken);
        });

        it('should throw an error for an invalid payload', () => {
            invalidPayloads.forEach((payload) => {
                expect(() => createJwtAccessToken(payload as IJwtPayload)).toThrow(
                    'Invalid payload structure',
                );
            });
        });
    });

    describe('createJwtRefreshToken', () => {
        it('should create a signed JWT refresh token', () => {
            (jwt.sign as jest.Mock).mockReturnValue(mockRefreshToken);
            const token = createJwtRefreshToken(mockPayload);

            expect(jwt.sign).toHaveBeenCalledWith(mockPayload, appConfig.JWT_REFRESH_SECRET, {
                expiresIn: appConfig.JWT_REFRESH_EXPIRY_TIME,
            });
            expect(token).toBe(mockRefreshToken);
        });

        it('should throw an error for an invalid payload', () => {
            invalidPayloads.forEach((payload) => {
                expect(() => createJwtRefreshToken(payload as IJwtPayload)).toThrow(
                    'Invalid payload structure',
                );
            });
        });
    });

    describe('verifyJwtAccessToken', () => {
        it('should verify and return the JWT access token payload', () => {
            (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
            const decoded = verifyJwtAccessToken(mockAccessToken);

            expect(jwt.verify).toHaveBeenCalledWith(mockAccessToken, appConfig.JWT_ACCESS_SECRET);
            expect(decoded).toEqual(mockPayload);
        });

        it('should throw an error if access token verification fails', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            expect(() => verifyJwtAccessToken(mockAccessToken)).toThrow('Invalid token');
        });
    });

    describe('verifyJwtRefreshToken', () => {
        it('should verify and return the JWT refresh token payload', () => {
            (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
            const decoded = verifyJwtRefreshToken(mockRefreshToken);

            expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, appConfig.JWT_REFRESH_SECRET);
            expect(decoded).toEqual(mockPayload);
        });

        it('should throw an error if refresh token verification fails', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            expect(() => verifyJwtRefreshToken(mockRefreshToken)).toThrow('Invalid token');
        });
    });
});
