import {Injectable, signal, WritableSignal} from "@angular/core";
import {ColumnConfig} from "../models/colmun-config.model";
import {Subject} from "rxjs";
import {ActionConfig, BulkActionConfig} from "../models/actions.mode";

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


@Injectable({providedIn:'root'})
export class DataTableConfig<T = any> {
    // ── Table ──────────────────────────────────────────────────────────────────
    readonly tableConfig: TableConfig<T> = {
        columns: signal<ColumnConfig[]>([]),
        actions: signal<ActionConfig[]>([]),
        bulkActions: signal<BulkActionConfig[]>([]),
        rows: signal<T[]>([]),
        dataKey: signal<string>("_id"),
        loading: signal<boolean>(false),
        isError: signal<boolean>(false),
        isSelectable: signal<boolean>(false),
        refetchEvent: new Subject<void>(),
         // ─── pagination ─────────────────────────────────────────
        currentPage:  signal(1),
        limit:        signal(10),
        total:        signal(0),
        totalPages:   signal(0),
    };



    

}
