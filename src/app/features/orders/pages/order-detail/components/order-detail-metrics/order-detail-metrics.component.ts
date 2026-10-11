import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-order-detail-metrics',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-detail-metrics.component.html',
  styleUrl: './order-detail-metrics.component.scss'
})
export class OrderDetailMetricsComponent {
  order = input.required<Order>();
  totalUnits = input.required<number>();

  get statusKey(): string {
    const status = this.order().status;
    const map: Record<string, string> = {
      in_process: 'ORDERS.STATUS.IN_PROCESS',
      ready:      'ORDERS.STATUS.READY',
      completed:  'ORDERS.STATUS.COMPLETED',
      cancelled:  'ORDERS.STATUS.CANCELLED',
    };
    return map[status] ?? 'ORDERS.STATUS.IN_PROCESS';
  }
}
