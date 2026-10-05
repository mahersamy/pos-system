import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { InventoryApiService } from "./inventory-api.service";
import { Inventory } from "../model/inventory.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";
import { GlobalPaginatedResponse } from "../../../core/models/response-global.model";
import { InventoryState } from "../state/inventory.state";

@Injectable({ providedIn: "root" })
export class InventoryFacade extends BaseFacade<Inventory> {
    protected override readonly _state = inject(InventoryState);
    protected readonly _api = inject(InventoryApiService);

    // 🔗 BaseFacade hooks ─────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel): Observable<GlobalPaginatedResponse<Inventory[]>> =>
        this._api.getAll(params);

    protected _deleteApi = (id: string) => this._api.delete(id);

    // ─── CREATE ────────────────────────────────────────────────────────────────

    createInventory(data: Partial<Inventory>, imageFile: File | null = null) {
        this._state.setLoading(true);
        this._state.setError(false);
        return this._api.create(data).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: (res) => {
                // If an image was provided, upload it right after creation
                if (imageFile && res.data?._id) {
                    this.uploadInventoryImage(res.data._id, imageFile);
                } else {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                }
            },
            error: () => {
                this._state.setLoading(false);
                this._state.setError(true);
            }
        });
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    updateInventory(id: string, data: Partial<Inventory>, imageFile: File | null = null) {
        this._state.setLoading(true);
        this._state.setError(false);
        return this._api.update(id, data).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: () => {
                if (imageFile) {
                    this.uploadInventoryImage(id, imageFile);
                } else {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                }
            },
            error: () => {
                this._state.setLoading(false);
                this._state.setError(true);
            }
        });
    }

    // ─── UPLOAD IMAGE ─────────────────────────────────────────────────────────

    uploadInventoryImage(id: string, image: File) {
        this._state.setLoading(true);
        this._state.setError(false);
        return this._api.uploadImage(id, image)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._state.setLoading(false);
                    this._state.setCloseDialog(true);
                },
                error: () => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                },
            });
    }
}
