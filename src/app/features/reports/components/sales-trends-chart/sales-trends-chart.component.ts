import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TranslateModule } from '@ngx-translate/core';
import { SalesTrends } from '../../models/sales-report.model';

@Component({
    selector: 'app-sales-trends-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, TranslateModule],
    templateUrl: './sales-trends-chart.component.html',
    styleUrls: ['./sales-trends-chart.component.scss'],
})
export class SalesTrendsChartComponent {
    trends = input<SalesTrends | null>(null);
    isBrowser = input<boolean>(true);

    readonly chartData = computed(() => {
        const t = this.trends();
        if (!t || !t.items?.length) return { labels: [], datasets: [] };
        return {
            labels: t.items.map((i) => i.periodLabel),
            datasets: [
                {
                    label: 'Sales',
                    data: t.items.map((i) => i.sales),
                    fill: true,
                    backgroundColor: 'rgba(250,193,217,0.15)',
                    borderColor: '#fac1d9',
                    borderWidth: 2,
                    tension: 0.42,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#fac1d9',
                },
                {
                    label: 'Orders',
                    data: t.items.map((i) => i.orderCount),
                    fill: false,
                    borderColor: '#7f9cf5',
                    borderWidth: 2,
                    tension: 0.42,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#7f9cf5',
                    yAxisID: 'y1',
                },
            ],
        };
    });

    readonly chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { labels: { color: '#d9d9d9', usePointStyle: true, pointStyleWidth: 10 } },
            tooltip: {
                backgroundColor: '#292c2d',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleColor: '#ffffff',
                bodyColor: '#d9d9d9',
            },
        },
        scales: {
            x: { ticks: { color: '#777979' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: {
                ticks: { color: '#777979', callback: (v: number) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}` },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
            y1: {
                position: 'right' as const,
                ticks: { color: '#7f9cf5' },
                grid: { drawOnChartArea: false },
            },
        },
    };
}
