import makeApiCall from "../apiCalls";
import authApiUrls from "../urls/auth";
import { IResponse } from "../../types/api";
import { IResetPasswordRequest, ISignin, ISignup } from "../../types";
import { IForgotPasswordEmail } from "../../pages/ForgotPassword";


export const signinApi = async (data: ISignin): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.signinUrl, data);
};

export const signupApi = async (data: ISignup): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.signupUrl, data);
};

export const verifyOtpApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.verifyOtpUrl, data);
};

export const resendOtpApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.resendOtpUrl, data);
};

export const forgotPasswordApi = async (data: IForgotPasswordEmail): Promise<IResponse> => {
    return await makeApiCall("post", authApiUrls.forgotPasswordUrl, data);
};

export const verifyResetTokenApi = async (data: {resetToken: string}): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.verifyResetTokenUrl, data);
};

export const resetPasswordApi = async (data: IResetPasswordRequest): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.resetPasswordUrl, data);
};

export const logoutApi = async (): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.logoutUrl);
};