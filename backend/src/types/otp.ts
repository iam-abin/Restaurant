export interface IOtpToken {
    userId: string;
    otp: string;
    resetToken: string;
}

export interface IEmailTemplate {
    html: string;
    emailSubject: string;
}
