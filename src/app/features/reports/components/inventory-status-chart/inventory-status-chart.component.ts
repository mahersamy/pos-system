import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TranslateModule } from '@ngx-translate/core';
import { InventorySummary } from '../../models/inventory-report.model';

@Component({
    selector: 'app-inventory-status-chart',
    standalone: true,
    imports: [CommonModule, ChartModule, TranslateModule],
    templateUrl: './inventory-status-chart.component.html',
    styleUrls: ['./inventory-status-chart.component.scss'],
})
export class InventoryStatusChartComponent {
    summary = input<InventorySummary | null>(null);
    isBrowser = input<boolean>(true);

    readonly chartData = computed(() => {
        const inv = this.summary();
        if (!inv) return { labels: [], datasets: [] };
        return {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [
                {
                    label: 'SKUs',
                    data: [inv.inStockCount, inv.lowStockCount, inv.outOfStockCount],
                    backgroundColor: [
                        'rgba(52,211,153,0.7)',
                        'rgba(251,191,36,0.7)',
                        'rgba(248,113,113,0.7)',
                    ],
                    borderRadius: 6,
                },
            ],
        };
    });

    readonly chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#d9d9d9' }, grid: { display: false } },
            y: { ticks: { color: '#777979' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
    };
}
