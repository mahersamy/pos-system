export interface GetAllModel {
    page: number;
    limit: number;
    search?: string;
    sort?: string;
    [key: string]: any;
}
