// ─── Field Types ─────────────────────────────────────────
export enum FilterFieldType {
    SELECT = "SELECT",
    TEXT = "TEXT",
    RANGE = "RANGE",
    DATE = "DATE",
}

export interface FilterFieldConfig {
    type: FilterFieldType;
    controlName: string;
    label: string;
    placeholder?: string;
}

export interface RangeFilterConfig extends FilterFieldConfig {
    type: FilterFieldType.RANGE;
    rangeMin?: number;
    rangeMax?: number;
}

export interface SelectFilterConfig extends FilterFieldConfig {
    type: FilterFieldType.SELECT;
    typeSelect?: "single" | "multi";
    select_list?: {label: string; value: any}[];
}

export interface TextFilterConfig extends FilterFieldConfig {
    type: FilterFieldType.TEXT;
}

export interface DateFilterConfig extends FilterFieldConfig {
    type: FilterFieldType.DATE;
}

export type FilterConfig =
    | RangeFilterConfig
    | SelectFilterConfig
    | TextFilterConfig
    | DateFilterConfig;

export interface FilterOutput {
    search: string;
    sort: "asc" | "desc";
    [key: string]: any;
}
