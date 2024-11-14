import makeApiCall from "../apiCalls";
import { IResponse } from "../../types/api";
import profileApiUrls from "../urls/profile";


export const getProfileApi = async (): Promise<IResponse> => {
	return await makeApiCall("get", profileApiUrls.getProfileUrl);
};

export const updateProfileApi = async (): Promise<IResponse> => {
	return await makeApiCall("patch", profileApiUrls.updateProfileUrl);
};