import { TrendGroupBy } from '../enums/trend-group-by.enum';
import { OrderType } from '../../orders/enums/order-type.enum';

export type ReportOrderType = OrderType | 'dine_in' | 'delivery';

/**
 * Matches SalesSummaryResponseDto from Swagger.
 * Returned by GET /reports/sales and /reports/sales/summary.
 */
export interface SalesSummary {
    startDate: string;
    endDate: string;
    currency: string;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    grossSales: number;
    discountTotal: number;
    refundTotal: number;
    netSales: number;
    averageOrderValue: number;
}

/** Matches SalesTrendItemDto from Swagger */
export interface TrendItem {
    periodStart: string;
    periodLabel: string;
    orderCount: number;
    sales: number;
    averageOrderValue: number;
}

/** Matches SalesTrendsResponseDto from Swagger */
export interface SalesTrends {
    groupBy: TrendGroupBy;
    startDate: string;
    endDate: string;
    items: TrendItem[];
}

/** Matches SalesByOrderTypeItemDto from Swagger */
export interface SalesByTypeItem {
    orderType: ReportOrderType;
    orderCount: number;
    sales: number;
    averageOrderValue: number;
    percentageOfSales: number;
}

/** Matches SalesByOrderTypeResponseDto from Swagger */
export interface SalesByOrderType {
    startDate: string;
    endDate: string;
    totalSales: number;
    items: SalesByTypeItem[];
}
