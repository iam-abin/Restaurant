export interface IOtp {
    userId: string
    otp: string
}

export interface IEmailTemplate {
    html: string
    emailSubject: string
}

export interface IResetPassword {
    password: string
    confirmPassword: string
}

export interface IResetPasswordRequest {
    userId: string
    password: string
}
