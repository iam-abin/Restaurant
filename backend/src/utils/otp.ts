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

// Function to check weather the given time has passed before sending otp again if otp is not expired.
export const checkOtpIntervalCompleted = (
    createdTime: Date,
    otpResendThreshold: number = 60 * 1000, // default 1 minute threshold
): boolean => {
    const timeSinceLastOtp: number = new Date().getTime() - createdTime.getTime();
    const isCompeted: boolean = timeSinceLastOtp > otpResendThreshold;
    return isCompeted;
};
