export interface ResponseGlobal<T> {
    data: T;
    statusCode: number;
    success: boolean;
}
