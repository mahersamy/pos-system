import {Injectable} from "@angular/core";
import { BaseApiService } from "../../../core/base/base-api.base";
import { Order } from "../models/order.model";
import { BACKEND_ROUTE } from "../../../core/constants/backend.route";

@Injectable({
    providedIn: "root",
})
export class OrderApiService extends BaseApiService<Order> {
    constructor(){
        super(BACKEND_ROUTE.order.base);
    }
}
