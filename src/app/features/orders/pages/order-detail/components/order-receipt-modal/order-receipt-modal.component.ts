import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Order, getCreatedByName } from '../../../../models/order.model';
import { OrderType } from '../../../../enums/order-type.enum';

@Component({
  selector: 'app-order-receipt-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-receipt-modal.component.html',
  styleUrl: './order-receipt-modal.component.scss'
})
export class OrderReceiptModalComponent {
  order = input.required<Order>();
  totalUnits = input.required<number>();

  close = output<void>();
  print = output<void>();

  get typeKey(): string {
    return this.order().orderType === OrderType.DELIVERY
      ? 'ORDERS.TYPE.DELIVERY'
      : 'ORDERS.TYPE.DINE_IN';
  }
}
