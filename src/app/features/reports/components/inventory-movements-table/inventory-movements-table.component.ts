import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StockMovementsReport } from '../../models/inventory-report.model';

@Component({
    selector: 'app-inventory-movements-table',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './inventory-movements-table.component.html',
    styleUrls: ['./inventory-movements-table.component.scss'],
})
export class InventoryMovementsTableComponent {
    report = input<StockMovementsReport | null>(null);

    movementDeltaClass(delta: number): string {
        return delta > 0 ? 'delta--pos' : delta < 0 ? 'delta--neg' : 'delta--zero';
    }

    movementTypeLabel(type: string): string {
        const map: Record<string, string> = {
            stock_in: 'Stock In',
            stock_out: 'Stock Out',
            sale: 'Sale',
            sale_reversal: 'Sale Reversal',
            adjustment: 'Adjustment',
            return: 'Return',
        };
        return map[type] ?? type;
    }
}
