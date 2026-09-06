import { inject, Injectable, signal } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { MenuApiService } from "./menu-api.service";
import { Menu } from "../model/menu.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";
import { GlobalPaginatedResponse, GlobalResponse } from "../../../core/models/response-global.model";
import { MenuState } from "../state/menu.state";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: "root" })
export class MenuFacade extends BaseFacade<Menu> {
    protected override readonly _state = inject(MenuState);
    protected readonly _api = inject(MenuApiService);

    // ── BaseFacade hooks ────────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel): Observable<GlobalPaginatedResponse<Menu[]>> =>
        this._api.getAll(params);

    protected _deleteApi = (id: string) => this._api.delete(id);

    // ── Menu-unique: save (create or update) ─────────────────────────────────
    createMenu(data: Partial<Menu>) {
        this._state.setLoading(true);
        this._state.setError(false);
        return this._api.create(data).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: () => {
                this._state.setLoading(false);
                this._state.setCloseDialog(true);
            },
            error: () => {
                this._state.setLoading(false);
                this._state.setError(true);
            }
        })
    }

    updateMenu(id: string, data: Partial<Menu>) {
        this._state.setLoading(true);
        this._state.setError(false);
        return this._api.update(id, data).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: () => {
                this._state.setLoading(false);
                this._state.setCloseDialog(true);
            },
            error: () => {
                this._state.setLoading(false);
                this._state.setError(true);
            }
        })
    }

    // ── Dropdown options for other features (e.g. Category form) ─────────────
    readonly menuOptions = signal<{ label: string; value: string }[]>([]);
    readonly menuOptionsLoading = signal(false);

    loadMenuOptions(): void {
        if (this.menuOptions().length > 0) return; // already loaded, skip
        this.menuOptionsLoading.set(true);
        this._api.getAllForDropdown().pipe(
            takeUntilDestroyed(this._destroyRef),
            map((menus) => menus.map((m) => ({ label: m.name, value: m._id })))
        ).subscribe({
            next: (options) => {
                this.menuOptions.set(options);
                this.menuOptionsLoading.set(false);
            },
            error: () => this.menuOptionsLoading.set(false)
        });
    }
}
