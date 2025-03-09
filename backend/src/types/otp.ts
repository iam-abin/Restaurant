import { IUserDocument } from '../database/models';
import { IUser } from './user';

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
    user: IUser | IUserDocument;
    otpOrTokenExpiresAt: Date;
}
