import otpGenerator from 'otp-generator';

export const generateOtp = (): string => {
    const OTP_LENGTH = 6;
    const otp: string = otpGenerator.generate(OTP_LENGTH, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    return otp;
};
