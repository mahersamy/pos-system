import { ColumnConfig } from "../../../../shared/components/data-table/models/colmun-config.model";
import { TableColumnType } from "../../../../shared/components/data-table/enums/colmun-type.enum";
import { ActionConfig, BulkActionConfig } from "../../../../shared/components/data-table/models/actions.mode";
import {
    FilterFieldType,
    FilterConfig,
} from "../../../../shared/components/filter-panel/interface/filter-panel.models";

// ─── Columns ──────────────────────────────────────────────────────────────────

export const AUDIT_LOGS_TABLE_COLUMNS: ColumnConfig[] = [
    {
        field: "createdAt",
        header: "Date & Time",
        type: TableColumnType.DATE,
        dateFormat: "d-MMM-y HH:mm:ss",
    },
    {
        field: "action",
        header: "Action",
        type: TableColumnType.STATUS,
        statusOptions: [
            { value: "CREATE", label: "CREATE", variant: "success" },
            { value: "UPDATE", label: "UPDATE", variant: "info" },
            { value: "DELETE", label: "DELETE", variant: "danger" },
            { value: "LOGIN",  label: "LOGIN",  variant: "warning" },
            { value: "LOGOUT", label: "LOGOUT", variant: "default" },
        ],
    },
    {
        field: "entity",
        header: "Entity",
        type: TableColumnType.TEXT,
    },
    {
        field: "performedBy",
        header: "Performed By",
        type: TableColumnType.TEXT,
    },
    {
        field: "ipAddress",
        header: "IP Address",
        type: TableColumnType.TEXT,
    },
];

// ─── Action display metadata ───────────────────────────────────────────────────

export const AUDIT_LOGS_TABLE_ACTION_META: Omit<ActionConfig, "func">[] = [];
export const AUDIT_LOGS_TABLE_BULK_ACTIONS: Omit<BulkActionConfig, "func">[] = [];

// ─── Filter Config ──────────────────────────────────────────────────────────

export const AUDIT_LOGS_FILTER_CONFIG: FilterConfig[] = [
    {
        type: FilterFieldType.SELECT,
        controlName: "action",
        label: "Action",
        select_list: [
            { label: "CREATE", value: "CREATE" },
            { label: "UPDATE", value: "UPDATE" },
            { label: "DELETE", value: "DELETE" },
            { label: "LOGIN", value: "LOGIN" },
            { label: "LOGOUT", value: "LOGOUT" },
        ],
    },
    {
        type: FilterFieldType.TEXT,
        controlName: "entity",
        label: "Entity",
        placeholder: "e.g. User, Order",
    },
    {
        type: FilterFieldType.DATE,
        controlName: "startDate",
        label: "Start Date",
    },
    {
        type: FilterFieldType.DATE,
        controlName: "endDate",
        label: "End Date",
    },
];
