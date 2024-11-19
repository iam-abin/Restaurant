const AUTH_URL = `/auth`

const authApiUrls = {
    signinUrl: `${AUTH_URL}/signin`,
    signupUrl: `${AUTH_URL}/signup`,
    verifyOtpUrl: `${AUTH_URL}/verify/otp`,
    resendOtpUrl: `${AUTH_URL}/resend-otp`,
    resetPasswordUrl: `${AUTH_URL}/password/reset`,
    verifyResetTokenUrl: `${AUTH_URL}/verify/reset-token`,
    forgotPasswordEmailUrl: `${AUTH_URL}/password/forgot`,
    logoutUrl: `${AUTH_URL}/logout`
}

export default authApiUrls
