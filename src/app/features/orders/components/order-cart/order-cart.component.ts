import { Component, input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../pages/order-create/order-create.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-order-cart',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.scss']
})
export class OrderCartComponent {
  cartItems = input<CartItem[]>([]);
  cartTotal = input<number>(0);

  changeQty = output<{ itemId: string, delta: number }>();
  removeFromCart = output<string>();

  onChangeQty(itemId: string, delta: number) {
    this.changeQty.emit({ itemId, delta });
  }

  onRemove(itemId: string) {
    this.removeFromCart.emit(itemId);
  }
}
