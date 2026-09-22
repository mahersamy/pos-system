import { Injectable } from "@angular/core";
import { BaseState } from "../../../core/base/base-state.base";
import { Order } from "../models/order.model";

@Injectable({ providedIn: "root" })
export class OrdersState extends BaseState<Order> {
    // Add any orders-specific signals here in future
}
