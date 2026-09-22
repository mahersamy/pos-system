import { inject, Injectable } from "@angular/core";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { Order } from "../models/order.model";
import { OrdersState } from "../state/orders.state";
import { OrderApiService } from "./order-api.service";
import { Observable } from "rxjs";
import { GetAllModel } from "../../../core/models/get-all.model";
import { GlobalPaginatedResponse, GlobalResponse } from "../../../core/models/response-global.model";

@Injectable({ providedIn: "root" })
export class OrdersFacade extends BaseFacade<Order> {
    protected override readonly _state = inject(OrdersState);
    private readonly _api = inject(OrderApiService);

    // ── BaseFacade hooks ─────────────────────────────────────────────────────
    protected override _loadApi(params: GetAllModel): Observable<GlobalPaginatedResponse<Order[]>> {
        return this._api.getAll(params);
    }

    protected override _deleteApi(id: string): Observable<GlobalResponse> {
        return this._api.delete(id);
    }
}
