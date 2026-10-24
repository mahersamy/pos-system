import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LowStockReport } from '../../models/inventory-report.model';
import { CompactCurrencyPipe } from '../../../../shared/pipes/compact-currency.pipe';

@Component({
    selector: 'app-inventory-low-stock-table',
    standalone: true,
    imports: [CommonModule, TranslateModule, CompactCurrencyPipe],
    templateUrl: './inventory-low-stock-table.component.html',
    styleUrls: ['./inventory-low-stock-table.component.scss'],
})
export class InventoryLowStockTableComponent {
    report = input<LowStockReport | null>(null);
}
