import { TrendGroupBy } from '../enums/trend-group-by.enum';
import { StockMovementType } from '../enums/stock-movement-type.enum';
import { ReportOrderType } from './sales-report.model';
import { OrderStatus } from '../../orders/enums/order-status.enum';

export type ReportOrderStatus = OrderStatus | 'in_process' | 'completed' | 'cancelled' | 'ready';

export interface SalesSummaryParams {
    startDate?: string;
    endDate?: string;
    orderType?: ReportOrderType;
    status?: ReportOrderStatus;
}

export interface SalesTrendsParams {
    startDate?: string;
    endDate?: string;
    groupBy?: TrendGroupBy;
    orderType?: ReportOrderType;
    status?: ReportOrderStatus;
}

export interface SalesByOrderTypeParams {
    startDate?: string;
    endDate?: string;
    status?: ReportOrderStatus;
}

export interface InventoryLowStockParams {
    page?: number;
    limit?: number;
    threshold?: number;
    categoryId?: string;
}

export interface InventoryMovementsParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    inventoryId?: string;
    type?: StockMovementType;
    referenceId?: string;
}
