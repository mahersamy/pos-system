import { signal } from "@angular/core";
import { FilterOutput } from "../../shared/components/filter-panel/interface/filter-panel.models";

/**
 * @abstract BaseState<TModel>
 *
 * Holds all shared reactive state for a feature slice:
 * items, loading, error, filter and closeDialog.
 *
 * Feature states extend this class and may add domain-specific signals.
 *
 * ### Usage
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class StaffState extends BaseState<StaffAdaptModel> {}
 * ```
 */
export abstract class BaseState<TModel> {
    // ── Private signals ──────────────────────────────────────────────────────
    private readonly _items        = signal<TModel[]>([]);
    private readonly _loading      = signal(false);
    private readonly _error        = signal(false);
    private readonly _closeDialog  = signal(false);
    private readonly _filter       = signal<FilterOutput>({ search: "", sort: "desc" });
    
    // Pagination signals
    private readonly _page         = signal(1);
    private readonly _limit        = signal(10);
    private readonly _total        = signal(0);
    private readonly _totalPages   = signal(0);

    // ── Public readonly views ────────────────────────────────────────────────
    readonly items       = this._items.asReadonly();
    readonly loading     = this._loading.asReadonly();
    readonly error       = this._error.asReadonly();
    readonly closeDialog = this._closeDialog.asReadonly();
    readonly filter      = this._filter.asReadonly();
    
    readonly page        = this._page.asReadonly();
    readonly limit       = this._limit.asReadonly();
    readonly total       = this._total.asReadonly();
    readonly totalPages  = this._totalPages.asReadonly();

    // ── Setters (used only by the facade) ────────────────────────────────────
    setItems(items: TModel[])       { this._items.set(items); }
    setLoading(v: boolean)          { this._loading.set(v); }
    setError(v: boolean)            { this._error.set(v); }
    setCloseDialog(v: boolean)      { this._closeDialog.set(v); }
    setFilter(filter: FilterOutput) { this._filter.set(filter); }
    
    setPage(v: number)              { this._page.set(v); }
    setLimit(v: number)             { this._limit.set(v); }
    setTotal(v: number)             { this._total.set(v); }
    setTotalPages(v: number)        { this._totalPages.set(v); }
}
