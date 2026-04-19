// ─── Field Types ─────────────────────────────────────────
export enum FilterFieldType {
  SELECT = 'SELECT',
  TEXT   = 'TEXT',
  RANGE  = 'RANGE',
  DATE   = 'DATE',
}

export interface FilterFieldConfig {
  type: FilterFieldType;
  controlName: string;
  label: string;
  placeholder?: string;
  // SELECT
  typeSelect?: 'single' | 'multi';
  select_list?: { label: string; value: any }[];
  // RANGE
  rangeMin?: number;
  rangeMax?: number;
}

export interface FilterOutput {
  search: string;
  sort: 'asc' | 'desc' | null;
  [key: string]: any;
}
