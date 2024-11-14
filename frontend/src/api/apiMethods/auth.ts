import makeApiCall from "../apiCalls";
import authApiUrls from "../urls/auth";
import { IResponse } from "../../types/api";


export const signinApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.signinUrl, data);
};

export const signupApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.signupUrl, data);
};

export const verifyOtpApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.verifyOtpUrl, data);
};

export const resendOtpApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.resendOtpUrl, data);
};

export const resetPasswordApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.resetPasswordUrl, data);
};

export const forgotPasswordApi = async (data: any): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.forgotPasswordUrl, data);
};

export const logoutApi = async (): Promise<IResponse> => {
	return await makeApiCall("post", authApiUrls.logoutUrl);
};