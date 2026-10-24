import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GlobalResponse } from '../../../core/models/response-global.model';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';
import {
    SalesSummary, SalesTrends, SalesByOrderType,
    InventorySummary, LowStockReport, StockMovementsReport,
    SalesSummaryParams, SalesTrendsParams, SalesByOrderTypeParams,
    InventoryLowStockParams, InventoryMovementsParams,
} from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportApiService {
    private readonly _http    = inject(HttpClient);
    private readonly _apiUrl  = environment.apiUrl;

    // ── Helper ────────────────────────────────────────────────────────────────

    private _buildParams(obj: Record<string, unknown>): HttpParams {
        let params = new HttpParams();
        for (const [k, v] of Object.entries(obj)) {
            if (v !== undefined && v !== null && v !== '') {
                params = params.set(k, String(v));
            }
        }
        return params;
    }

    // ── Sales ─────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/reports/sales/summary
     * Returns KPI metrics: gross/net sales, order counts, AOV.
     */
    getSalesSummary(filters: SalesSummaryParams = {}): Observable<GlobalResponse<SalesSummary>> {
        return this._http.get<GlobalResponse<SalesSummary>>(
            `${this._apiUrl}${BACKEND_ROUTE.reports.salesSummary}`,
            { params: this._buildParams(filters as Record<string, unknown>) }
        );
    }

    /**
     * GET /api/v1/reports/sales/trends
     * Returns time-series revenue + order volume grouped by day / week / month.
     */
    getSalesTrends(filters: SalesTrendsParams = {}): Observable<GlobalResponse<SalesTrends>> {
        return this._http.get<GlobalResponse<SalesTrends>>(
            `${this._apiUrl}${BACKEND_ROUTE.reports.salesTrends}`,
            { params: this._buildParams(filters as Record<string, unknown>) }
        );
    }

    /**
     * GET /api/v1/reports/sales/by-order-type
     * Compares dine-in vs delivery order volume, sales, and share.
     */
    getSalesByOrderType(filters: SalesByOrderTypeParams = {}): Observable<GlobalResponse<SalesByOrderType>> {
        return this._http.get<GlobalResponse<SalesByOrderType>>(
            `${this._apiUrl}${BACKEND_ROUTE.reports.salesByOrderType}`,
            { params: this._buildParams(filters as Record<string, unknown>) }
        );
    }

    // ── Inventory ─────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/reports/inventory/summary
     * Returns SKU counts by stock status and total retail valuation.
     */
    getInventorySummary(categoryId?: string): Observable<GlobalResponse<InventorySummary>> {
        const params = categoryId ? new HttpParams().set('categoryId', categoryId) : undefined;
        return this._http.get<GlobalResponse<InventorySummary>>(
            `${this._apiUrl}${BACKEND_ROUTE.reports.inventorySummary}`,
            { params }
        );
    }

    /**
     * GET /api/v1/reports/inventory/low-stock
     * Returns paginated items at or below their reorder threshold.
     */
    getInventoryLowStock(filters: InventoryLowStockParams = {}): Observable<GlobalResponse<LowStockReport>> {
        return this._http.get<GlobalResponse<LowStockReport>>(
            `${this._apiUrl}${BACKEND_ROUTE.reports.inventoryLowStock}`,
            { params: this._buildParams(filters as Record<string, unknown>) }
        );
    }

    /**
     * GET /api/v1/reports/inventory/movements
     * Returns paginated audit trail of stock additions, deductions, and adjustments.
     */
    getInventoryMovements(filters: InventoryMovementsParams = {}): Observable<GlobalResponse<StockMovementsReport>> {
        return this._http.get<GlobalResponse<StockMovementsReport>>(
            `${this._apiUrl}${BACKEND_ROUTE.reports.inventoryMovements}`,
            { params: this._buildParams(filters as Record<string, unknown>) }
        );
    }
}
