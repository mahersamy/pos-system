import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LowStockItem } from '../../models/dashboard.model';

@Component({
    selector: 'app-low-stock-table',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './low-stock-table.component.html',
    styleUrls: ['./low-stock-table.component.scss'],
})
export class LowStockTableComponent {
    readonly items = input<LowStockItem[]>([]);
}
