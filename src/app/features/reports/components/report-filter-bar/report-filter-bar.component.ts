import { Component, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TrendGroupBy } from '../../models/index';
import { OrderType } from '../../models/report.model';

@Component({
    selector: 'app-report-filter-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './report-filter-bar.component.html',
    styleUrls: ['./report-filter-bar.component.scss'],
})
export class ReportFilterBarComponent {
    startDate = model<string>('');
    endDate = model<string>('');
    groupBy = model<TrendGroupBy>('day');
    orderType = model<OrderType | ''>('');

    readonly apply = output<void>();
    readonly reset = output<void>();

    onApply(): void {
        this.apply.emit();
    }

    onReset(): void {
        this.reset.emit();
    }
}
