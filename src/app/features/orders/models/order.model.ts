import { OrderStatus } from "../enums/order-status.enum";
import { OrderType } from "../enums/order-type.enum";

export interface Order {

    id: string;
    orderNumber: string;
    status: OrderStatus;
    orderType: OrderType;
    orderItems: [
        {
            inventory: string,
            quantity: number
        }
    ],
    totalAmount: number,
    table: string,
    guestName: string,
    deliveryInfo: string,
    phoneNumber: string,
    cancellationReason: string,
    createdBy: string,
    updatedBy: string,
}
