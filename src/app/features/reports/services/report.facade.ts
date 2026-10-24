import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ReportApiService } from './report-api.service';
import { ReportState } from '../state/report.state';
import {
    SalesSummaryParams, SalesTrendsParams, SalesByOrderTypeParams,
    InventoryLowStockParams, InventoryMovementsParams,
} from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportFacade {
    private readonly _api     = inject(ReportApiService);
    private readonly _state   = inject(ReportState);
    private readonly _destroy = inject(DestroyRef);

    // ── Exposed signals ───────────────────────────────────────────────────────
    readonly salesSummary     = this._state.salesSummary;
    readonly salesTrends      = this._state.salesTrends;
    readonly salesByOrderType = this._state.salesByOrderType;
    readonly inventorySummary = this._state.inventorySummary;
    readonly lowStockReport   = this._state.lowStockReport;
    readonly movementsReport  = this._state.movementsReport;
    readonly loading          = this._state.loading;
    readonly error            = this._state.error;

    // ── Unified load (called on page init) ────────────────────────────────────

    /**
     * Loads Sales Summary + Trends + By-Order-Type + Inventory Summary in parallel.
     * Trends and ByOrderType use whatever filter params are passed in.
     */
    loadAll(
        salesParams: SalesSummaryParams = {},
        trendsParams: SalesTrendsParams = {},
        byTypeParams: SalesByOrderTypeParams = {},
    ): void {
        this._state.setLoading(true);
        this._state.setError(false);

        forkJoin({
            summary:     this._api.getSalesSummary(salesParams),
            trends:      this._api.getSalesTrends(trendsParams),
            byType:      this._api.getSalesByOrderType(byTypeParams),
            invSummary:  this._api.getInventorySummary(),
        })
        .pipe(takeUntilDestroyed(this._destroy))
        .subscribe({
            next: (res) => {
                this._state.setSalesSummary(res.summary.data);
                this._state.setSalesTrends(res.trends.data);
                this._state.setSalesByOrderType(res.byType.data);
                this._state.setInventorySummary(res.invSummary.data);
                this._state.setLoading(false);
            },
            error: () => {
                this._state.setLoading(false);
                this._state.setError(true);
            },
        });
    }

    // ── Individual loaders (for filter refreshes) ─────────────────────────────

    loadSalesSummary(params: SalesSummaryParams = {}): void {
        this._api.getSalesSummary(params)
            .pipe(takeUntilDestroyed(this._destroy))
            .subscribe({ next: (r) => this._state.setSalesSummary(r.data) });
    }

    loadSalesTrends(params: SalesTrendsParams = {}): void {
        this._api.getSalesTrends(params)
            .pipe(takeUntilDestroyed(this._destroy))
            .subscribe({ next: (r) => this._state.setSalesTrends(r.data) });
    }

    loadSalesByOrderType(params: SalesByOrderTypeParams = {}): void {
        this._api.getSalesByOrderType(params)
            .pipe(takeUntilDestroyed(this._destroy))
            .subscribe({ next: (r) => this._state.setSalesByOrderType(r.data) });
    }

    loadInventorySummary(categoryId?: string): void {
        this._api.getInventorySummary(categoryId)
            .pipe(takeUntilDestroyed(this._destroy))
            .subscribe({ next: (r) => this._state.setInventorySummary(r.data) });
    }

    loadLowStock(params: InventoryLowStockParams = {}): void {
        this._api.getInventoryLowStock(params)
            .pipe(takeUntilDestroyed(this._destroy))
            .subscribe({ next: (r) => this._state.setLowStockReport(r.data) });
    }

    loadMovements(params: InventoryMovementsParams = {}): void {
        this._api.getInventoryMovements(params)
            .pipe(takeUntilDestroyed(this._destroy))
            .subscribe({ next: (r) => this._state.setMovementsReport(r.data) });
    }
}
