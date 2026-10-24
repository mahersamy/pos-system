import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InventorySummary } from '../../models/inventory-report.model';
import { CompactCurrencyPipe } from '../../../../shared/pipes/compact-currency.pipe';

@Component({
    selector: 'app-inventory-kpi-cards',
    standalone: true,
    imports: [CommonModule, TranslateModule, CompactCurrencyPipe],
    templateUrl: './inventory-kpi-cards.component.html',
    styleUrls: ['./inventory-kpi-cards.component.scss'],
})
export class InventoryKpiCardsComponent {
    summary = input<InventorySummary | null>(null);
}
