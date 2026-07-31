import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";
import { ConfirmationService } from "../services/confirmation/confirmation";
import { FilterOutput } from "../../shared/components/filter-panel/interface/filter-panel.models";
import { GetAllModel } from "../models/get-all.model";
import { LayoutService } from "../services/layout/layout";
import { GlobalResponse } from "../models/response-global.model";
import { BaseState } from "./base-state.base";

/**
 * @abstract BaseFacade<TModel>
 *
 * Generic facade base class. All shared state lives in the injected
 * BaseState subclass — no duplicate signals here.
 *
 * ### Usage
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class StaffFacade extends BaseFacade<StaffAdaptModel> {
 *   protected override readonly _state = inject(StaffState);
 *   protected readonly _api = inject(StaffService);
 *   protected _loadApi    = (p: GetAllModel)  => this._api.getAll(p);
 *   protected _deleteApi  = (id: string)      => this._api.delete(id);
 *   protected _deleteManyApi = (ids: string[]) => this._api.deleteManyStaff(ids);
 * }
 * ```
 */
export abstract class BaseFacade<TModel> {
    protected readonly _confirmationService = inject(ConfirmationService);
    protected readonly _layout = inject(LayoutService);
    protected readonly _destroyRef = inject(DestroyRef);

    // ── Abstract: feature state & API hooks ──────────────────────────────────
    /** Inject the feature-specific BaseState subclass in the subclass. */
    protected abstract readonly _state: BaseState<TModel>;

    protected abstract _loadApi(params: GetAllModel): Observable<TModel[]>;
    protected abstract _deleteApi(id: string): Observable<GlobalResponse>;

    // ── Expose state signals (delegated, no duplication) ────────────────────
    get items()       { return this._state.items; }
    get loading()     { return this._state.loading; }
    get error()       { return this._state.error; }
    get closeDialog() { return this._state.closeDialog; }

    resetCloseDialog(): void { this._state.setCloseDialog(false); }

    // ── Reads ────────────────────────────────────────────────────────────────
    load(): void {
        this._state.setLoading(true);
        this._state.setError(false);
        this._loadApi({ page: 1, limit: 10, ...this._state.filter() }).pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
            next: (data) => {
                this._state.setItems(data);
                this._state.setLoading(false);
            },
            error: () => {
                this._state.setLoading(false);
                this._state.setError(true);
            },
        });
    }

    setFilter(filter: FilterOutput): void {
        this._state.setFilter(filter);
        this.load();
    }

    // ── Writes ───────────────────────────────────────────────────────────────
    deleteOne(id: string): void {
        this._confirmationService.confirm({
            header: `Delete ${this._layout.title()}`,
            message: "Do you want to delete this record?",
            type: "delete",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Action: () => {
                this._confirmationService.isBtn1Loading.set(true);
                this._state.setLoading(true);
                this._deleteApi(id).pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
                    next: () => {
                        this._confirmationService.isBtn1Loading.set(false);
                        this._confirmationService.close();
                        this.load();
                    },
                    error: () => {
                        this._confirmationService.isBtn1Loading.set(false);
                        this._state.setLoading(false);
                        this._state.setError(true);
                    },
                });
            },
            btn2Action: () => this._confirmationService.close(),
        });
    }

}
