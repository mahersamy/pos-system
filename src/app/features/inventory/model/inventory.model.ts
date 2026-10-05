import { InventoryStock, InventoryStatus } from '../enums/inventory.enum';

export interface Inventory {
    _id: string;
    name: string;
    category: string | { _id: string; name: string };
    quantity: number;
    stock: InventoryStock;
    status: InventoryStatus;
    price: number;
    perishable: boolean;
    image?: {
        public_id: string;
        secure_url: string;
    };
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInventoryPayload {
    name: string;
    category: string;
    quantity: number;
    stock?: InventoryStock;
    status?: InventoryStatus;
    price: number;
    perishable?: boolean;
}

export interface UpdateInventoryPayload extends Partial<CreateInventoryPayload> {}
