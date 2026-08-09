import {TableColumnType} from "../enums/colmun-type.enum";
import { StatusOption } from "../components/status-cell/status-cell";

// ─── Base ─────────────────────────────────────────────────────────────────────
interface BaseColumnConfig {
    field: string;
    header: string;
}

// ─── Per-cell extended configs ────────────────────────────────────────────────
export interface IdColumnConfig extends BaseColumnConfig {
    type: TableColumnType.ID;
}

export interface TextColumnConfig extends BaseColumnConfig {
    type: TableColumnType.TEXT;
    classes?: string;
    suffix?: string;
}

export interface DateColumnConfig extends BaseColumnConfig {
    type: TableColumnType.DATE;
    dateFormat?: string;
    classes?: string;
}

export interface UserColumnConfig extends BaseColumnConfig {
    type: TableColumnType.USER;
    subtitleField?: string;
    imageField?: string;
    subtitleColor?: string;
}

export interface CurrencyColumnConfig extends BaseColumnConfig {
    type: TableColumnType.CURRENCY;
    currencyCode?: string;
    currencyDisplay?: string;
    digitsInfo?: string;
    classes?: string;
}

export interface SelectColumnConfig extends BaseColumnConfig {
    type: TableColumnType.SELECT;
    options?: { label: string; value: any }[];
    onChange?: (data: any, newValue: any) => void;
}

export interface StatusColumnConfig extends BaseColumnConfig {
    type: TableColumnType.STATUS;
    statusOptions: StatusOption[];
}

// ─── Union — use this everywhere ─────────────────────────────────────────────
export type ColumnConfig =
    | IdColumnConfig
    | TextColumnConfig
    | DateColumnConfig
    | UserColumnConfig
    | CurrencyColumnConfig
    | SelectColumnConfig
    | StatusColumnConfig;
