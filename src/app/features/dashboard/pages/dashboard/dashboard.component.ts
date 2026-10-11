import { Component, inject, OnInit, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { DashboardFacade } from '../../services/dashboard.facade';
import { DashboardStatCardComponent } from '../../components/stat-card/stat-card.component';
import { PopularDishesTableComponent } from '../../components/popular-dishes-table/popular-dishes-table.component';
import { LowStockTableComponent } from '../../components/low-stock-table/low-stock-table.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ChartModule,
        DashboardStatCardComponent,
        PopularDishesTableComponent,
        LowStockTableComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    readonly facade = inject(DashboardFacade);
    private readonly platformId = inject(PLATFORM_ID);

    readonly isBrowser = isPlatformBrowser(this.platformId);

    // ── Chart data derived from overview signal ──────────────────────────────
    readonly chartData = computed(() => {
        const overview = this.facade.overview();
        return {
            labels: overview.map((o) => o.name),
            datasets: [
                {
                    label: 'Sales',
                    data: overview.map((o) => o.dineInSales),
                    fill: true,
                    backgroundColor: 'rgba(250,193,217,0.15)',
                    borderColor: '#fac1d9',
                    borderWidth: 2,
                    tension: 0.45,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fac1d9',
                },
                {
                    label: 'Revenue',
                    data: overview.map((o) => o.totalRevenue),
                    fill: false,
                    borderColor: '#777979',
                    borderWidth: 2,
                    tension: 0.45,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#777979',
                },
            ],
        };
    });

    readonly chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                labels: { color: '#d9d9d9', usePointStyle: true, pointStyleWidth: 10 },
            },
            tooltip: {
                backgroundColor: '#292c2d',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleColor: '#ffffff',
                bodyColor: '#d9d9d9',
                callbacks: {
                    label: (ctx: any) => ` ${ctx.dataset.label}: $${ctx.parsed.y?.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#777979' },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
            y: {
                ticks: {
                    color: '#777979',
                    callback: (v: number) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`,
                },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
        },
    };

    ngOnInit(): void {
        this.facade.loadAll();
    }

    formatCurrency(value: number): string {
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
        return `$${value.toFixed(0)}`;
    }
}
