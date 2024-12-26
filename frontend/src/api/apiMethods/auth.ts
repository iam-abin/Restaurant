import makeApiCall from '../apiCall';
import authApiUrls from '../urls/auth';
import { IResponse } from '../../types/api';
import { IGoogleAuth, IOtp, IResetPasswordRequest, ISignin, ISignup } from '../../types';
import { IForgotPasswordEmail } from '../../pages/common/ForgotPasswordEmail';

export const signinApi = async (data: ISignin): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.signinUrl, data);
};

export const signupApi = async (data: ISignup): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.signupUrl, data);
};

export const googleAuthApi = async (data: IGoogleAuth): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.googleAuthUrl, data);
};

export const verifyOtpApi = async (data: IOtp): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.verifyOtpUrl, data);
};

export const resendOtpApi = async (data: { userId: string }): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.resendOtpUrl, data);
};

export const ForgotPasswordEmailApi = async (data: IForgotPasswordEmail): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.forgotPasswordEmailUrl, data);
};

export const verifyResetTokenApi = async (data: { resetToken: string }): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.verifyResetTokenUrl, data);
};

export const resetPasswordApi = async (data: IResetPasswordRequest): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.resetPasswordUrl, data);
};

export const blockUnblockUserApi = async (userId: string): Promise<IResponse> => {
    return await makeApiCall('patch', authApiUrls.blockUnblockUserUrl(userId));
};

export const logoutApi = async (): Promise<IResponse> => {
    return await makeApiCall('post', authApiUrls.logoutUrl);
};
