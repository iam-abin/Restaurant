import { IUser } from './user';

export interface IOtp {
    userId: string;
    otp: string;
}

// export interface IOtpToken {
//     userId: string;
//     otp: string;
//     resetToken: string;
// }

export interface IEmailTemplate {
    html: string;
    emailSubject: string;
}

export interface IResetPassword {
    password: string;
    confirmPassword: string;
}

export interface IResetPasswordRequest {
    userId: string;
    password: string;
}
export interface IOtpResponse {
    user: IUser;
    otpOrTokenExpiresAt: Date;
}

export interface IOtp {
    otp: string;
}
