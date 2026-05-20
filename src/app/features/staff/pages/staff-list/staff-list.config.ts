import {ColumnConfig} from "../../../../shared/components/data-table/models/colmun-config.model";
import {TableColumnType} from "../../../../shared/components/data-table/enums/colmun-type.enum";
import {
    ActionConfig,
    BulkActionConfig,
} from "../../../../shared/components/data-table/models/actions.mode";
import {
    FilterFieldType,
    RangeFilterConfig,
} from "../../../../shared/ui/filter-panel/interface/filter-panel.models";

// ─── Columns ──────────────────────────────────────────────────────────────────

export const STAFF_TABLE_COLUMNS: ColumnConfig[] = [
    {
        field: "_id",
        header: "STAFF.FIELDS.ID",
        type: TableColumnType.ID,
    },
    {
        field: "staffProfile.fullname",
        header: "STAFF.FIELDS.NAME",
        type: TableColumnType.USER,
        subtitleField: "staffProfile.position",
        imageField: "staffProfile.image",
    },
    {
        field: "age",
        header: "STAFF.FIELDS.AGE",
        type: TableColumnType.TEXT,
        suffix: " yr",
    },
    {
        field: "email",
        header: "STAFF.FIELDS.EMAIL",
        type: TableColumnType.TEXT,
    },
    {
        field: "phoneNumber",
        header: "STAFF.FIELDS.PHONE",
        type: TableColumnType.TEXT,
    },
    {
        field: "salary",
        header: "STAFF.FIELDS.SALARY",
        type: TableColumnType.CURRENCY,
        currencyCode: "USD",
        currencyDisplay: "symbol",
    },
    {
        field: "dateOfBirth",
        header: "STAFF.FIELDS.DOB",
        type: TableColumnType.DATE,
        dateFormat: "d-MMM-y",
    },
    {
        field: "timing",
        header: "STAFF.FIELDS.TIMING",
        type: TableColumnType.TEXT,
    },
];

// ─── Action display metadata ───────────────────────────────────────────────────
// Only visual shape (icon, classes). The `func` handler is always set by the
// component — this file has zero logic and zero service dependencies.

export const STAFF_TABLE_ACTION_META: Omit<ActionConfig, "func">[] = [
    {icon: "fa-solid fa-eye", classes: "preview-button"},
    {icon: "fa-solid fa-pencil", classes: "edit-button"},
    {icon: "fa-solid fa-trash", classes: "delete-button"},
];

// ─── Bulk Actions ──────────────────────────────────────────────────────────

export const STAFF_TABLE_BULK_ACTIONS: Omit<BulkActionConfig, "func">[] = [
    {label: "STAFF.ACTIONS.DELETE_SELECTED", icon: "fa-solid fa-trash", classes: "btn-danger"},
];

// ─── Filter Config ──────────────────────────────────────────────────────────

export const STAFF_FILTER_CONFIG: RangeFilterConfig[] = [
    {
        type: FilterFieldType.RANGE,
        controlName: "salary",
        label: "Salary",
        rangeMin: 0,
        rangeMax: 100000,
    },
];
