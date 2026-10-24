import { StockMovementType } from '../enums/stock-movement-type.enum';

/** Matches InventorySummaryResponseDto from Swagger */
export interface InventorySummary {
    totalSkus: number;
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalStockValue: number;
    currency: string;
    valuationMethod: string;
}

/** Matches InventoryLowStockItemDto from Swagger */
export interface LowStockReportItem {
    inventoryId: string;
    name: string;
    category?: { _id: string; name: string };
    quantity: number;
    reorderLevel: number;
    stock: string;
    price: number;
}

/** Matches InventoryLowStockResponseDto from Swagger */
export interface LowStockReport {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    items: LowStockReportItem[];
}

/** Matches InventoryMovementItemDto from Swagger */
export interface StockMovement {
    _id: string;
    inventoryId: string;
    inventoryName?: string;
    type: StockMovementType;
    quantityDelta: number;
    quantityBefore: number;
    quantityAfter: number;
    referenceType?: string;
    referenceId?: string;
    actorId?: string;
    actorName?: string;
    reason?: string;
    createdAt: string;
}

/** Matches InventoryMovementResponseDto from Swagger */
export interface StockMovementsReport {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    items: StockMovement[];
}
