import { axiosInstance } from "./axiosInstance";

const makeApiCall = async (
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    isFileUpload: boolean = false
): Promise<any> => {
    try {
        const config = isFileUpload ? { headers: { "Content-Type": "multipart/form-data" } } : {};
        const response = await axiosInstance[method](url, data, config);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export default makeApiCall;