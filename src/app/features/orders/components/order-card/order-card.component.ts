import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inventory } from '../../../inventory/model/inventory.model';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent {
  item = input.required<Inventory>();
  cartQty = input(0);
  categoryName = input('');
  
  @Output() cardClick = new EventEmitter<Inventory>();

  onClick() {
    this.cardClick.emit(this.item());
  }
}
