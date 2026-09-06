import { ColumnConfig } from "../../../../shared/components/data-table/models/colmun-config.model";
import { TableColumnType } from "../../../../shared/components/data-table/enums/colmun-type.enum";
import { ActionConfig } from "../../../../shared/components/data-table/models/actions.mode";
import { InventoryStatus, InventoryStock } from "../../enums/inventory.enum";

// ─── Columns ───────────────────────────────────────────────────────────────────

export const INVENTORY_TABLE_COLUMNS: ColumnConfig[] = [
    {
        field: "_id",
        header: "INVENTORY.FIELDS.ID",
        type: TableColumnType.ID,
    },
    {
        field: "name",
        header: "INVENTORY.FIELDS.NAME",
        type: TableColumnType.TEXT,
    },
    {
        field: "quantity",
        header: "INVENTORY.FIELDS.QUANTITY",
        type: TableColumnType.TEXT,
    },
    {
        field: "price",
        header: "INVENTORY.FIELDS.PRICE",
        type: TableColumnType.CURRENCY,
    },
    {
        field: "stock",
        header: "INVENTORY.FIELDS.STOCK",
        type: TableColumnType.STATUS,
        statusOptions: [
            { value: InventoryStock.INSTOCK, label: "In Stock", variant: "success" },
            { value: InventoryStock.LOWSTOCK, label: "Low Stock", variant: "warning" },
            { value: InventoryStock.OUTOFSTOCK, label: "Out of Stock", variant: "danger" },
        ],
    },
    {
        field: "status",
        header: "INVENTORY.FIELDS.STATUS",
        type: TableColumnType.STATUS,
        statusOptions: [
            { value: InventoryStatus.ACTIVE, label: "Active", variant: "success" },
            { value: InventoryStatus.INACTIVE, label: "Inactive", variant: "danger" },
        ],
    },
    {
        field: "perishable",
        header: "INVENTORY.FIELDS.PERISHABLE",
        type: TableColumnType.STATUS,
        statusOptions: [
            { value: true, label: "Yes", variant: "warning" },
            { value: false, label: "No", variant: "success" },
        ],
    },
    {
        field: "createdAt",
        header: "INVENTORY.FIELDS.DATE",
        type: TableColumnType.DATE,
        dateFormat: "d-MMM-y",
    },
];

// ─── Action display metadata ────────────────────────────────────────────────────

export const INVENTORY_TABLE_ACTION_META: Omit<ActionConfig, "func">[] = [
    { icon: "fa-solid fa-pen-to-square", classes: "edit-button" },
    { icon: "fa-solid fa-trash", classes: "delete-button" },
];
