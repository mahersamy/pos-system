import {DestroyRef, Injectable, signal, WritableSignal} from "@angular/core";
import {ColumnConfig} from "../models/colmun-config.model";
import {Observable, Subject} from "rxjs";
import {ActionConfig, BulkActionConfig} from "../models/actions.mode";
import { PaginatedResponse } from "../../../../core/models/paginated-response.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
    // ─── pagination ─────────────────────────────────────────
    currentPage: WritableSignal<number>;
    limit: WritableSignal<number>;
    total: WritableSignal<number>;
    totalPages: WritableSignal<number>;
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
        columns:      signal([]),
        actions:      signal([]),
        bulkActions:  signal([]),
        rows:         signal([]),
        dataKey:      signal("_id"),
        loading:      signal(true),
        isError:      signal(false),
        isSelectable: signal(false),
        refetchEvent: new Subject<void>(),
         // ─── pagination ─────────────────────────────────────────
        currentPage:  signal(1),
        limit:        signal(10),
        total:        signal(0),
        totalPages:   signal(0),
    };

    // ── Bulk Actions (future) ──────────────────────────────────────────────────
    // readonly bulkActionConfig: BulkActionConfig = { ... };


    
    
    /**
     * ─── Added during pagination ─────────────────────────────────────────────
     * Universal data loader — pass in ANY service observable that returns
     * PaginatedResponse<T> and this handles loading, error, pagination state.
     *
     * Usage in any feature:
     *   this._dataTableConfig.loadData(
     *     this._staffService.getStaffs({ page: 1, limit: 10 }),
     *     this._destroyRef
     *   );
     *
     * @param source$ - The service observable returning PaginatedResponse<T>
     * @param destroyRef - The component's DestroyRef for auto-unsubscribe
     */
    loadData(source$: Observable<PaginatedResponse<T>>, destroyRef: DestroyRef): void {
        this.tableConfig.loading.set(true);
        this.tableConfig.isError.set(false);
 
        source$
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe({
                next: (response) => {
                    this.tableConfig.rows.set(response.data as T[]);
                    this.tableConfig.total.set(response.total);
                    this.tableConfig.totalPages.set(response.totalPages);
                    this.tableConfig.currentPage.set(response.page);
                    this.tableConfig.limit.set(response.limit);
                    this.tableConfig.loading.set(false);
                },
                error: (error) => {
                    console.error("DataTableConfig: Failed to load data", error);
                    this.tableConfig.loading.set(false);
                    this.tableConfig.isError.set(true);
                },
            });
    }
}
