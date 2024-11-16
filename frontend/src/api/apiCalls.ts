import { axiosInstance } from "./axiosInstance";
import { hotToastMessage } from "../utils/hotToast"
import { IResponse } from "../types/api";
import { AxiosError } from "axios";

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
    } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.errors) {
            hotToastMessage(error.response.data.errors[0].message, "error");
        } else {
            hotToastMessage("Something went wrong", "error");
        }
        throw error;
    }
};

export default makeApiCall;