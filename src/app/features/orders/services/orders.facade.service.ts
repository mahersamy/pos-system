import { inject, Injectable, signal } from "@angular/core";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { Order } from "../models/order.model";
import { OrdersState } from "../state/orders.state";
import { OrderApiService, UpdateOrderStatusPayload } from "./order-api.service";
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { GetAllModel } from "../../../core/models/get-all.model";
import { GlobalPaginatedResponse, GlobalResponse } from "../../../core/models/response-global.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: "root" })
export class OrdersFacade extends BaseFacade<Order> {
    protected override readonly _state = inject(OrdersState);
    private readonly _api = inject(OrderApiService);

    // ── Create-order signals (used by cashier order-create page) ─────────────
    readonly isCreating  = signal(false);
    readonly createError = signal(false);
    readonly createSuccess = signal(false);

    // ── BaseFacade hooks ─────────────────────────────────────────────────────
    protected override _loadApi(params: GetAllModel): Observable<GlobalPaginatedResponse<Order[]>> {
        return this._api.getAll(params);
    }

    protected override _deleteApi(id: string): Observable<GlobalResponse> {
        return this._api.delete(id);
    }

    // ── Cashier: create a new order ──────────────────────────────────────────
    createOrder(payload: Partial<Order>, idempotencyKey?: string): void {
        this.isCreating.set(true);
        this.createError.set(false);
        this.createSuccess.set(false);

        let headers: HttpHeaders | undefined = undefined;
        if (idempotencyKey) {
            headers = new HttpHeaders().set('Idempotency-Key', idempotencyKey);
        }

        this._api.create(payload, headers)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this.isCreating.set(false);
                    this.createSuccess.set(true);
                },
                error: () => {
                    this.isCreating.set(false);
                    this.createError.set(true);
                },
            });
    }

    resetCreateState(): void {
        this.isCreating.set(false);
        this.createError.set(false);
        this.createSuccess.set(false);
    }

    // ── Cashier: change order status ─────────────────────────────────────────
    readonly isUpdatingStatus = signal(false);

    changeOrderStatus(id: string, payload: UpdateOrderStatusPayload): void {
        this.isUpdatingStatus.set(true);
        this._api.updateStatus(id, payload)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this.isUpdatingStatus.set(false);
                    this._confirmationService.isBtn1Loading.set(false);
                    this._confirmationService.close();
                    this.load();
                },
                error: () => {
                    this.isUpdatingStatus.set(false);
                    this._confirmationService.isBtn1Loading.set(false);
                },
            });
    }
}
