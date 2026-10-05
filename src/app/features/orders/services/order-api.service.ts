import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/base/base-api.base';
import { Order } from '../models/order.model';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';
import { GlobalResponse } from '../../../core/models/response-global.model';
import { OrderStatus } from '../enums/order-status.enum';

export interface UpdateOrderStatusPayload {
    status: OrderStatus;
    cancellationReason?: string;
}

@Injectable({
    providedIn: 'root',
})
export class OrderApiService extends BaseApiService<Order> {
    constructor() {
        super(BACKEND_ROUTE.order.base);
    }

    updateStatus(id: string, payload: UpdateOrderStatusPayload): Observable<GlobalResponse<Order>> {
        return this.update(id, payload);
    }
}
