import axios from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type ApiCallParams = {
    method: HttpMethod;
    url: string;
    data?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    isFileUpload?: boolean;
};

/**
 * Makes an HTTP API call using Axios.
 *
 * @param {ApiCallParams} - The parameters for the API call.
 * @returns {Promise<any>} - The data returned from the API response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeApiCall = async ({ method, url, data, isFileUpload = false }: ApiCallParams): Promise<any> => {
    const config = isFileUpload ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await axios[method](url, data, config);
    return response.data;
};

export default makeApiCall;
