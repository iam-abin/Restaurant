export interface IResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ApiErrorResponse {
    errors?: Array<{ message: string }>;
}
