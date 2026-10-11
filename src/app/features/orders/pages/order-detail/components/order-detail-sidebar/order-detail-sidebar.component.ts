import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Order, getCreatedByName } from '../../../../models/order.model';
import { OrderType } from '../../../../enums/order-type.enum';

@Component({
  selector: 'app-order-detail-sidebar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './order-detail-sidebar.component.html',
  styleUrl: './order-detail-sidebar.component.scss'
})
export class OrderDetailSidebarComponent {
  order = input.required<Order>();
  copiedField = input<string | null>(null);

  copyField = output<{ text: string; field: string }>();

  get typeKey(): string {
    return this.order().orderType === OrderType.DELIVERY
      ? 'ORDERS.TYPE.DELIVERY'
      : 'ORDERS.TYPE.DINE_IN';
  }

  /** Safe human-readable creator name */
  get createdByName(): string {
    return getCreatedByName(this.order().createdBy);
  }

  /** Safe human-readable updater name */
  get updatedByName(): string {
    return getCreatedByName(this.order().updatedBy);
  }

  onCopy(text: string | undefined, field: string): void {
    if (!text) return;
    this.copyField.emit({ text, field });
  }
}
