import { OrderStatus } from "../enums/order-status.enum";
import { OrderType } from "../enums/order-type.enum";

/** Matches OrderItemResponseDto — price snapshot captured at order creation */
export interface OrderItem {
    inventory: string;   // Inventory Item ID
    name: string;        // Item name at time of order
    unitPrice: number;   // Unit price at time of order
    quantity: number;    // Quantity ordered
    lineTotal: number;  // unitPrice × quantity
}

/** Matches CreateOrderDto — sent when placing a new order */
export interface CreateOrderItem {
    inventoryId: string;
    quantity: number;
}

export interface CreatorUser {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    name?: string;
    email?: string;
}

/** Matches OrderResponseDto */
export interface Order {
    _id: string;
    orderNumber: string;
    status: OrderStatus;
    orderType: OrderType;
    orderItems: OrderItem[];
    totalAmount: number;
    table?: string;
    guestName?: string;
    deliveryInfo?: string;
    phoneNumber?: string;
    cancellationReason?: string;
    createdBy: string | CreatorUser;
    updatedBy?: string | CreatorUser;
    createdAt: string;
    updatedAt: string;
}

/** Extracts a human-readable display name from a createdBy / updatedBy field */
export function getCreatedByName(user: string | CreatorUser | undefined | null): string {
    if (!user) return '';
    if (typeof user === 'string') return user;
    if (user.fullName) return user.fullName;
    if (user.name) return user.name;
    const parts = [user.firstName, user.lastName].filter(Boolean);
    if (parts.length > 0) return parts.join(' ');
    if (user.email) return user.email;
    return user._id || user.id || '';
}

