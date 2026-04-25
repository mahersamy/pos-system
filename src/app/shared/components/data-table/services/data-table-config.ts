import {Injectable, signal, WritableSignal} from "@angular/core";
import {ColumnConfig} from "../models/colmun-config.model";
import {Subject} from "rxjs";
import {ActionConfig, BulkActionConfig} from "../models/actions.mode";

// ─── Table Config ─────────────────────────────────────────────────────────────
export interface TableConfig<T = any> {
    columns: WritableSignal<ColumnConfig[]>;
    actions: WritableSignal<ActionConfig[]>;
    bulkActions: WritableSignal<BulkActionConfig[]>;
    rows: WritableSignal<T[]>;
    dataKey: WritableSignal<string>;
    loading: WritableSignal<boolean>;
    isError: WritableSignal<boolean>;
    isSelectable: WritableSignal<boolean>;
    refetchEvent: Subject<void>;
}

// ─── Filter Config (future) ────────────────────────────────────────────────────
// export interface FilterConfig { ... }

// ─── Bulk Action Config (future) ───────────────────────────────────────────────
// export interface BulkActionConfig { ... }

/**
 * Per-feature data-table config. NOT a global singleton.
 * Provide it locally in each feature page: `providers: [DataTableConfig]`
 */
@Injectable()
export class DataTableConfig<T = any> {
    // ── Table ──────────────────────────────────────────────────────────────────
    readonly tableConfig: TableConfig<T> = {
        columns: signal([]),
        actions: signal([]),
        bulkActions: signal([]),
        rows: signal([]),
        dataKey: signal("_id"),
        loading: signal(true),
        isError: signal(false),
        isSelectable: signal(false),
        refetchEvent: new Subject<void>(),
    };

    // ── Bulk Actions (future) ──────────────────────────────────────────────────
    // readonly bulkActionConfig: BulkActionConfig = { ... };
}
