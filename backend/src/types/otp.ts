import { IUserDocument } from '../database/model';

export interface IOtpToken {
    userId: string;
    otp: string;
    resetToken: string;
}

export interface IEmailTemplate {
    html: string;
    emailSubject: string;
}

export type OtpConfig = {
    digits: boolean;
    lowerCaseAlphabets: boolean;
    upperCaseAlphabets: boolean;
    specialChars: boolean;
};

export interface IOtpTokenData {
    user: IUserDocument;
    otpOrTokenExpiresAt: Date;
}
