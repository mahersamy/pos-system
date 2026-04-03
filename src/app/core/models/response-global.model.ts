export interface GlobalResponse<T> {
    data: T;
    statusCode: number;
    success: boolean;
}