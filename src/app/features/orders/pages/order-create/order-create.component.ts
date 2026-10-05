import {
    Component,
    computed,
    effect,
    inject,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { InventoryApiService } from '../../../inventory/services/inventory-api.service';
import { CategoryApiService } from '../../../category/services/category-api.service';
import { OrdersFacade } from '../../services/orders.facade.service';
import { Inventory } from '../../../inventory/model/inventory.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { OrderCartComponent } from '../../components/order-cart/order-cart.component';
import { OrderFormComponent } from '../../components/order-form/order-form.component';
import { OrderType } from '../../enums/order-type.enum';
import { Category } from '../../../category/model/category.model';

export interface CartItem {
    inventory: Inventory;
    quantity: number;
}

@Component({
    selector: 'app-order-create',
    imports: [CommonModule, FormsModule, EmptyStateComponent, OrderCardComponent, OrderCartComponent, OrderFormComponent],
    templateUrl: './order-create.component.html',
    styleUrls: ['./order-create.component.scss'],
})
export class OrderCreateComponent implements OnInit {
    private readonly _inventoryApi = inject(InventoryApiService);
    private readonly _categoryApi  = inject(CategoryApiService);
    private readonly _facade       = inject(OrdersFacade);
    private readonly _router       = inject(Router);
    private readonly _destroyRef   = inject(DestroyRef);

    @ViewChild(OrderFormComponent) orderForm?: OrderFormComponent;

    private _idempotencyKey = crypto.randomUUID();

    // ── Data ─────────────────────────────────────────────────────────────────
    readonly allItems       = signal<Inventory[]>([]);
    readonly categories     = signal<Category[]>([]);
    readonly isLoadingItems = signal(false);

    // ── Filters ───────────────────────────────────────────────────────────────
    readonly searchQuery         = signal('');
    readonly selectedCategoryId  = signal<string | null>(null);

    // ── Filtered view (computed) ──────────────────────────────────────────────
    readonly filteredItems = computed(() => {
        let items = this.allItems();
        const q   = this.searchQuery().trim().toLowerCase();
        const cat = this.selectedCategoryId();

        if (q) {
            items = items.filter((i) => i.name.toLowerCase().includes(q));
        }
        if (cat) {
            items = items.filter((i) => {
                const catId = typeof i.category === 'object' && i.category !== null
                    ? (i.category as any)._id
                    : i.category;
                return catId === cat;
            });
        }
        return items;
    });

    // ── Cart ─────────────────────────────────────────────────────────────────
    readonly cartItems = signal<CartItem[]>([]);

    readonly cartTotal = computed(() =>
        this.cartItems().reduce((acc, ci) => acc + ci.inventory.price * ci.quantity, 0)
    );

    readonly cartCount = computed(() =>
        this.cartItems().reduce((acc, ci) => acc + ci.quantity, 0)
    );

    // ── Order form ────────────────────────────────────────────────────────────
    readonly OrderType = OrderType;

    orderType    = signal<OrderType>(OrderType.DINE_IN);
    table        = signal('');
    guestName    = signal('');
    phoneNumber  = signal('');
    deliveryInfo = signal('');

    // ── Facade state ──────────────────────────────────────────────────────────
    readonly isCreating    = this._facade.isCreating;
    readonly createError   = this._facade.createError;
    readonly createSuccess = this._facade.createSuccess;

    constructor() {
        effect(() => {
            if (this.createSuccess()) {
                this._resetCart();
                this._facade.resetCreateState();
            }
        });
    }

    ngOnInit(): void {
        this._loadItems();
        this._loadCategories();
    }

    // ── Loaders ───────────────────────────────────────────────────────────────
    private _loadItems(): void {
        this.isLoadingItems.set(true);
        this._inventoryApi.getAll({ page: 1, limit: 1000 })
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this.allItems.set(res.data.filter((i) => i.quantity > 0));
                    this.isLoadingItems.set(false);
                },
                error: () => this.isLoadingItems.set(false),
            });
    }

    private _loadCategories(): void {
        this._categoryApi.getAllForDropdown()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (cats) => this.categories.set(cats),
                error: () => {},
            });
    }

    // ── Cart actions ──────────────────────────────────────────────────────────
    addToCart(item: Inventory): void {
        this._idempotencyKey = crypto.randomUUID();
        this.cartItems.update((cart) => {
            const idx = cart.findIndex((c) => c.inventory._id === item._id);
            if (idx > -1) {
                const updated = [...cart];
                updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
                return updated;
            }
            return [...cart, { inventory: item, quantity: 1 }];
        });
    }

    changeQty(itemId: string, delta: number): void {
        this._idempotencyKey = crypto.randomUUID();
        this.cartItems.update((cart) => {
            return cart
                .map((c) =>
                    c.inventory._id === itemId
                        ? { ...c, quantity: c.quantity + delta }
                        : c
                )
                .filter((c) => c.quantity > 0);
        });
    }

    removeFromCart(itemId: string): void {
        this._idempotencyKey = crypto.randomUUID();
        this.cartItems.update((cart) => cart.filter((c) => c.inventory._id !== itemId));
    }

    getCartQty(itemId: string): number {
        return this.cartItems().find((c) => c.inventory._id === itemId)?.quantity ?? 0;
    }

    isInCart(itemId: string): boolean {
        return this.cartItems().some((c) => c.inventory._id === itemId);
    }

    // ── Order actions ─────────────────────────────────────────────────────────
    placeOrder(): void {

        const payload: any = {
            orderType: this.orderType(),
            inventory: this.cartItems().map((c) => ({
                inventoryId: c.inventory._id,
                quantity:  c.quantity,
            })),
            totalAmount: this.cartTotal(),
        };

        if (this.orderType() === OrderType.DINE_IN) {
            const tableVal = String(this.table() || '').trim();
            const guestVal = String(this.guestName() || '').trim();
            if (tableVal) payload.table = tableVal;
            if (guestVal) payload.guestName = guestVal;
        } else {
            const guestVal = String(this.guestName() || '').trim();
            const phoneVal = String(this.phoneNumber() || '').trim();
            const deliveryVal = String(this.deliveryInfo() || '').trim();
            
            if (guestVal) payload.guestName = guestVal;
            if (phoneVal) payload.phoneNumber = phoneVal;
            if (deliveryVal) payload.deliveryInfo = deliveryVal;
        }

        this._facade.createOrder(payload, this._idempotencyKey);
    }

    goBack(): void {
        this._router.navigate(['/main/orders']);
    }

    // ── Filter helpers ────────────────────────────────────────────────────────
    onSearch(value: string): void {
        this.searchQuery.set(value);
    }

    selectCategory(id: string | null): void {
        this.selectedCategoryId.set(id);
    }

    getCategoryName(item: Inventory): string {
        if (!item.category) return '';
        if (typeof item.category === 'object' && 'name' in item.category) {
            return (item.category as any).name;
        }
        return '';
    }

    // ── Private helpers ───────────────────────────────────────────────────────
    private _resetCart(): void {
        this.cartItems.set([]);
        this.table.set('');
        this.guestName.set('');
        this.phoneNumber.set('');
        this.deliveryInfo.set('');
        this.orderType.set(OrderType.DINE_IN);
        this._idempotencyKey = crypto.randomUUID();
        if (this.orderForm) {
            this.orderForm.resetForm();
        }
    }
}
