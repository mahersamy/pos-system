import { ColumnConfig } from "../../../../shared/components/data-table/models/colmun-config.model";
import { TableColumnType } from "../../../../shared/components/data-table/enums/colmun-type.enum";
import { ActionConfig } from "../../../../shared/components/data-table/models/actions.mode";

// ─── Columns ───────────────────────────────────────────────────────────────────

export const CATEGORY_TABLE_COLUMNS: ColumnConfig[] = [
    {
        field: "_id",
        header: "CATEGORY.FIELDS.ID",
        type: TableColumnType.ID,
    },
    {
        field: "name",
        header: "CATEGORY.FIELDS.NAME",
        type: TableColumnType.TEXT,
    },
    {
        field: "description",
        header: "CATEGORY.FIELDS.DESCRIPTION",
        type: TableColumnType.TEXT,
    },
    {
        field: "isActive",
        header: "CATEGORY.FIELDS.STATUS",
        type: TableColumnType.STATUS,
        statusOptions: [
            { value: true, label: "Active", variant: "success" },
            { value: false, label: "Inactive", variant: "danger" },
        ],
    },
    {
        field: "createdAt",
        header: "CATEGORY.FIELDS.DATE",
        type: TableColumnType.DATE,
        dateFormat: "d-MMM-y",
    },
];

// ─── Action display metadata ────────────────────────────────────────────────────

export const CATEGORY_TABLE_ACTION_META: Omit<ActionConfig, "func">[] = [
    { icon: "fa-solid fa-pen-to-square", classes: "edit-button" },
    { icon: "fa-solid fa-trash", classes: "delete-button" },
];
