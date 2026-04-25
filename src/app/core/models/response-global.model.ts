export interface GlobalResponse<T> {
    data: T;
    statusCode: number;
    success: boolean;
}

export interface GlobalResponseWithCursor<T> extends GlobalResponse<T> {
    nextCursor: string;
    hasMore: boolean;
}
