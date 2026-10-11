import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Order, OrderItem } from '../../../../models/order.model';

@Component({
  selector: 'app-order-detail-items',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './order-detail-items.component.html',
  styleUrl: './order-detail-items.component.scss'
})
export class OrderDetailItemsComponent {
  order = input.required<Order>();
  totalUnits = input.required<number>();

  /** Search query within this order's items */
  searchItemTerm = signal<string>('');

  /** Filtered order items based on the search query */
  filteredItems = computed<OrderItem[]>(() => {
    const o = this.order();
    if (!o || !o.orderItems) return [];
    const term = this.searchItemTerm().trim().toLowerCase();
    if (!term) return o.orderItems;
    return o.orderItems.filter(item =>
      (item.name || '').toLowerCase().includes(term)
    );
  });
}
