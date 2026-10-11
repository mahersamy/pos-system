import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Order } from '../../../../models/order.model';
import { OrderType } from '../../../../enums/order-type.enum';

export interface StatusAction {
  label: string;
  status: any;
  cls: string;
}

@Component({
  selector: 'app-order-detail-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-detail-header.component.html',
  styleUrl: './order-detail-header.component.scss'
})
export class OrderDetailHeaderComponent {
  order = input.required<Order>();
  availableActions = input.required<StatusAction[]>();
  actionsOpen = input<boolean>(false);

  back = output<void>();
  print = output<void>();
  toggleActions = output<MouseEvent>();
  closeActions = output<void>();
  statusChange = output<StatusAction>();

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

  get statusClass(): string {
    const status = this.order().status;
    const map: Record<string, string> = {
      in_process: 'status-badge status-badge--process',
      ready:      'status-badge status-badge--ready',
      completed:  'status-badge status-badge--completed',
      cancelled:  'status-badge status-badge--cancelled',
    };
    return map[status] ?? 'status-badge';
  }

  get typeKey(): string {
    return this.order().orderType === OrderType.DELIVERY
      ? 'ORDERS.TYPE.DELIVERY'
      : 'ORDERS.TYPE.DINE_IN';
  }
}
