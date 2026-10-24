import { Injectable, signal } from '@angular/core';
import {
    SalesSummary, SalesTrends, SalesByOrderType,
    InventorySummary, LowStockReport, StockMovementsReport,
} from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportState {

    // ── Sales ─────────────────────────────────────────────────────────────────
    readonly salesSummary       = signal<SalesSummary | null>(null);
    readonly salesTrends        = signal<SalesTrends | null>(null);
    readonly salesByOrderType   = signal<SalesByOrderType | null>(null);

    // ── Inventory ─────────────────────────────────────────────────────────────
    readonly inventorySummary   = signal<InventorySummary | null>(null);
    readonly lowStockReport     = signal<LowStockReport | null>(null);
    readonly movementsReport    = signal<StockMovementsReport | null>(null);

    // ── UI Flags ──────────────────────────────────────────────────────────────
    readonly loading            = signal(false);
    readonly error              = signal(false);

    // ── Setters ───────────────────────────────────────────────────────────────
    setSalesSummary(v: SalesSummary | null)            { this.salesSummary.set(v); }
    setSalesTrends(v: SalesTrends | null)              { this.salesTrends.set(v); }
    setSalesByOrderType(v: SalesByOrderType | null)    { this.salesByOrderType.set(v); }
    setInventorySummary(v: InventorySummary | null)    { this.inventorySummary.set(v); }
    setLowStockReport(v: LowStockReport | null)        { this.lowStockReport.set(v); }
    setMovementsReport(v: StockMovementsReport | null) { this.movementsReport.set(v); }
    setLoading(v: boolean)                             { this.loading.set(v); }
    setError(v: boolean)                               { this.error.set(v); }
}
