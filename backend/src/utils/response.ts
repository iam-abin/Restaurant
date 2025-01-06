/**
 * Interface to standardize the structure of a success response.
 *
 * @template T - The type of data that can be included in the response.
 */
interface ISuccessResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

/**
 * Creates a standardized success response object.
 *
 * @param {string} message - The success message to include in the response.
 * @param {T} [data] - Optional data to include in the response.
 * @returns {ISuccessResponse<T>} - The success response object.
 */
export const createSuccessResponse = <T>(message: string, data?: T): ISuccessResponse<T> => {
    const response: ISuccessResponse<T> = { success: true, message };
    if (data) response.data = data;
    return response;
};
