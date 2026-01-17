export type TServiceResponse<T> = {
    data?: T;
    message: string;
    success: boolean;
    count?: number;
    errorMessage?: string;
    statusCode?: number;
};