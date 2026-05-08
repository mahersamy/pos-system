export interface GlobalResponse<T> {
    data: T;
    statusCode: number;
    success: boolean;
}


export interface GlobalResponseWithCursor<T> extends GlobalResponse<T> {
    nextCursor: string;
    hasMore: boolean;
}
// pagination 
export interface GlobalPaginatedResponse<T> extends GlobalResponse<T> {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}