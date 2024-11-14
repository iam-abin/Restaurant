import { axiosInstance } from "./axiosInstance";
import { hotToastMessage } from "../utils/hotToast"
import { IResponse } from "../types/api";

const makeApiCall = async (
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    isFileUpload: boolean = false
): Promise<IResponse> => {
    try {
        const config = isFileUpload ? { headers: { "Content-Type": "multipart/form-data" } } : {};
        const response = await axiosInstance[method](url, data, config);
        return response.data;
    } catch (error: any) {
        hotToastMessage(error.response?.data?.errors?.[0]?.message || "An error occurred", "error");
        throw error;
    }
};

export default makeApiCall;