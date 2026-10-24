import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReportFacade } from '../../services/report.facade';
import { TrendGroupBy, OrderType, OrderStatus } from '../../models/report.model';

import { ReportFilterBarComponent } from '../../components/report-filter-bar/report-filter-bar.component';
import { SalesKpiCardsComponent } from '../../components/sales-kpi-cards/sales-kpi-cards.component';
import { SalesTrendsChartComponent } from '../../components/sales-trends-chart/sales-trends-chart.component';
import { SalesByTypeCardComponent } from '../../components/sales-by-type-card/sales-by-type-card.component';
import { InventoryKpiCardsComponent } from '../../components/inventory-kpi-cards/inventory-kpi-cards.component';
import { InventoryStatusChartComponent } from '../../components/inventory-status-chart/inventory-status-chart.component';
import { InventoryLowStockTableComponent } from '../../components/inventory-low-stock-table/inventory-low-stock-table.component';
import { InventoryMovementsTableComponent } from '../../components/inventory-movements-table/inventory-movements-table.component';

type ReportTab = 'sales' | 'inventory';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReportFilterBarComponent,
        SalesKpiCardsComponent,
        SalesTrendsChartComponent,
        SalesByTypeCardComponent,
        InventoryKpiCardsComponent,
        InventoryStatusChartComponent,
        InventoryLowStockTableComponent,
        InventoryMovementsTableComponent,
    ],
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    readonly facade = inject(ReportFacade);
    private readonly platformId = inject(PLATFORM_ID);
    readonly isBrowser = isPlatformBrowser(this.platformId);

    // ── Tab State ─────────────────────────────────────────────────────────────
    activeTab = signal<ReportTab>('sales');

    // ── Filter State ──────────────────────────────────────────────────────────
    startDate = signal<string>(this._defaultStartDate());
    endDate = signal<string>(this._defaultEndDate());
    groupBy = signal<TrendGroupBy>('day');
    orderType = signal<OrderType | ''>('');
    orderStatus = signal<OrderStatus | ''>('');

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    ngOnInit(): void {
        this.applyFilters();
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    switchTab(tab: ReportTab): void {
        this.activeTab.set(tab);
        if (tab === 'inventory') {
            this.facade.loadLowStock({ page: 1, limit: 20 });
            this.facade.loadMovements({ page: 1, limit: 20 });
        }
    }

    applyFilters(): void {
        const base = {
            startDate: this.startDate() || undefined,
            endDate: this.endDate() || undefined,
        };
        const orderTypeVal = this.orderType() || undefined;
        const statusVal = this.orderStatus() || undefined;

        this.facade.loadAll(
            { ...base, orderType: orderTypeVal as any, status: statusVal as any },
            { ...base, groupBy: this.groupBy(), orderType: orderTypeVal as any, status: statusVal as any },
            { ...base, status: statusVal as any },
        );
    }

    resetFilters(): void {
        this.startDate.set(this._defaultStartDate());
        this.endDate.set(this._defaultEndDate());
        this.groupBy.set('day');
        this.orderType.set('');
        this.orderStatus.set('');
        this.applyFilters();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private _defaultStartDate(): string {
        const d = new Date();
        d.setDate(1); // first day of current month
        return d.toISOString().split('T')[0];
    }

    private _defaultEndDate(): string {
        return new Date().toISOString().split('T')[0];
    }
}
