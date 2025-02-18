import otpGenerator from 'otp-generator';
import {
    calculateExpiryTime,
    checkIsOtpTokenExpired,
    generateOtp,
    isOtpTOkenResendAllowed,
} from '../../src/utils';
import { OTP_LENGTH } from '../../src/constants';

jest.mock('otp-generator');

describe('OTP Utility Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generateOtp', () => {
        it('should generate an OTP of correct length', () => {
            (otpGenerator.generate as jest.Mock).mockReturnValue('123456');
            const otp = generateOtp();
            expect(otpGenerator.generate).toHaveBeenCalledWith(OTP_LENGTH, expect.any(Object));
            expect(otp).toBe('123456');
        });
    });

    describe('isOtpTOkenResendAllowed', () => {
        it('should return true if the resend interval has passed', () => {
            const pastTime = new Date(Date.now() - 61000); // 61 seconds ago
            expect(isOtpTOkenResendAllowed(pastTime)).toBe(true);
        });

        it('should return false if the resend interval has not passed', () => {
            const recentTime = new Date(Date.now() - 30000); // 30 seconds ago
            expect(isOtpTOkenResendAllowed(recentTime)).toBe(false);
        });
    });

    describe('checkIsOtpTokenExpired', () => {
        it('should return true if the OTP has expired', () => {
            const expiredTime = new Date(Date.now() - 1000); // 1 second in the past
            expect(checkIsOtpTokenExpired(expiredTime)).toBe(true);
        });

        it('should return false if the OTP has not expired', () => {
            const futureTime = new Date(Date.now() + 10000); // 10 seconds in the future
            expect(checkIsOtpTokenExpired(futureTime)).toBe(false);
        });
    });

    describe('calculateExpiryTime', () => {
        it('should return the correct remaining time in seconds', () => {
            const futureTime = new Date(Date.now() + 5000); // 5 seconds in the future
            expect(calculateExpiryTime(futureTime)).toBe(5);
        });

        it('should return 0 if the expiry time is in the past', () => {
            const pastTime = new Date(Date.now() - 5000); // 5 seconds in the past
            expect(calculateExpiryTime(pastTime)).toBe(0);
        });
    });
});
