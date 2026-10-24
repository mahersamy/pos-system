import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TranslateModule } from '@ngx-translate/core';
import { SalesByOrderType } from '../../models/sales-report.model';
import { CompactCurrencyPipe } from '../../../../shared/pipes/compact-currency.pipe';

@Component({
    selector: 'app-sales-by-type-card',
    standalone: true,
    imports: [CommonModule, ChartModule, TranslateModule, CompactCurrencyPipe],
    templateUrl: './sales-by-type-card.component.html',
    styleUrls: ['./sales-by-type-card.component.scss'],
})
export class SalesByTypeCardComponent {
    data = input<SalesByOrderType | null>(null);
    isBrowser = input<boolean>(true);

    readonly chartData = computed(() => {
        const bt = this.data();
        if (!bt || !bt.items?.length) return { labels: [], datasets: [] };
        return {
            labels: bt.items.map((i) => (i.orderType === 'dine_in' ? 'Dine-In' : 'Delivery')),
            datasets: [
                {
                    data: bt.items.map((i) => i.sales),
                    backgroundColor: ['#fac1d9', '#7f9cf5'],
                    hoverOffset: 8,
                },
            ],
        };
    });

    readonly chartOptions = {
        responsive: true,
        cutout: '68%',
        plugins: {
            legend: { position: 'bottom' as const, labels: { color: '#d9d9d9' } },
        },
    };
}
