import { inject, signal } from "@angular/core";
import { Observable } from "rxjs";
import { ConfirmationService } from "../services/confirmation/confirmation";
import { FilterOutput } from "../../shared/components/filter-panel/interface/filter-panel.models";
import { GetAllModel } from "../models/get-all.model";
import { LayoutService } from "../services/layout/layout";
import { GlobalResponse } from "../models/response-global.model";

/**
 * @abstract BaseFacade<TModel>
 *
 * Generic facade base class that encapsulates all shared state and
 * orchestration logic (load, filter, delete, bulk-delete with confirmation).
 *
 * ### Usage
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class StaffFacade extends BaseFacade<StaffAdaptModel> {
 *   protected readonly _api = inject(StaffService);
 *   protected _deleteManyApi = (ids: string[]) => this._api.deleteManyStaff(ids);
 *   protected _deleteLabel = 'staff';
 * }
 * ```
 */
export abstract class BaseFacade<TModel> {
    protected readonly _confirmationService = inject(ConfirmationService);
    protected readonly _layout = inject(LayoutService)
    // ── Abstract hooks ──────────────────────────────────────────────────────
    /** The feature API. Must be injected in the subclass. */
    protected abstract _loadApi(params: GetAllModel): Observable<TModel[]>;

    /** Called for bulk delete. Provide the feature-specific API call. */
    protected abstract _deleteManyApi(ids: string[]): Observable<GlobalResponse>;

    /** Called for single delete. Uses BaseApiService.delete by default. */
    protected abstract _deleteApi(id: string): Observable<GlobalResponse>;


    // ── State ───────────────────────────────────────────────────────────────
    private readonly _items = signal<TModel[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal(false);
    protected readonly _filter = signal<FilterOutput>({ search: "", sort: "desc" });

    readonly items = this._items.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    // ── Reads ───────────────────────────────────────────────────────────────
    load(): void {
        this._loading.set(true);
        this._error.set(false);
        this._loadApi({ page: 1, limit: 10, ...this._filter() }).subscribe({
            next: (data) => {
                this._items.set(data);
                this._loading.set(false);
            },
            error: () => {
                this._loading.set(false);
                this._error.set(true);
            },
        });
    }

    setFilter(filter: FilterOutput): void {
        this._filter.set(filter);
        this.load();
    }

    // ── Writes ──────────────────────────────────────────────────────────────
    deleteOne(id: string): void {
        this._confirmationService.confirm({
            header: `Delete ${this._layout.title}`,
            message: "Do you want to delete this record?",
            type: "delete",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Action: () => {
                this._confirmationService.isBtn1Loading.set(true);
                this._loading.set(true);
                this._deleteApi(id).subscribe({
                    next: () => {
                        this._confirmationService.isBtn1Loading.set(false);
                        this._confirmationService.close();
                        this.load();
                    },
                    error: () => {
                        this._confirmationService.isBtn1Loading.set(false);
                        this._loading.set(false);
                        this._error.set(true);
                    },
                });
            },
            btn2Action: () => this._confirmationService.close(),
        });
    }

    deleteMany(ids: string[]): void {
        if (!ids.length) return;
        this._confirmationService.confirm({
            header: "Danger Zone",
            message: "Do you want to delete the selected records?",
            type: "delete",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Action: () => {
                this._confirmationService.isBtn1Loading.set(true);
                this._loading.set(true);
                this._deleteManyApi(ids).subscribe({
                    next: () => {
                        this._confirmationService.isBtn1Loading.set(false);
                        this._confirmationService.close();
                        this.load();
                    },
                    error: () => {
                        this._confirmationService.isBtn1Loading.set(false);
                        this._loading.set(false);
                        this._error.set(true);
                    },
                });
            },
            btn2Action: () => this._confirmationService.close(),
        });
    }

    // ── Protected helpers ───────────────────────────────────────────────────
    protected _setLoading(v: boolean) { this._loading.set(v); }
    protected _setError(v: boolean) { this._error.set(v); }
}
