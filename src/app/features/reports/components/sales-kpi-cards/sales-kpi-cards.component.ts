import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SalesSummary } from '../../models/sales-report.model';
import { CompactCurrencyPipe } from '../../../../shared/pipes/compact-currency.pipe';

@Component({
    selector: 'app-sales-kpi-cards',
    standalone: true,
    imports: [CommonModule, TranslateModule, CompactCurrencyPipe],
    templateUrl: './sales-kpi-cards.component.html',
    styleUrls: ['./sales-kpi-cards.component.scss'],
})
export class SalesKpiCardsComponent {
    summary = input<SalesSummary | null>(null);
}
