import { TableColumnType } from '../enums/colmun-type.enum';

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

// ─── Union — use this everywhere ─────────────────────────────────────────────
export type ColumnConfig = IdColumnConfig | TextColumnConfig | DateColumnConfig | UserColumnConfig;
