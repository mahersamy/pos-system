import { inject, Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CategoryApiService } from "./category-api.service";
import { Category } from "../model/category.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";
import { GlobalPaginatedResponse } from "../../../core/models/response-global.model";
import { CategoryState } from "../state/category.state";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: "root" })
export class CategoryFacade extends BaseFacade<Category> {
    protected override readonly _state = inject(CategoryState);
    protected readonly _api = inject(CategoryApiService);

    // 🔗 BaseFacade hooks ─────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel): Observable<GlobalPaginatedResponse<Category[]>> =>
        this._api.getAll(params);

    protected _deleteApi = (id: string) => this._api.delete(id);

    // ─── CREATE ────────────────────────────────────────────────────────────────

    createCategory(data: Partial<Category>, imageFile: File | null = null) {
        this._state.setLoading(true);
        this._state.setError(false);
        return this._api.create(data).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: (res) => {
                // If an image was provided, upload it right after creation
                if (imageFile && res.data?._id) {
                    this.uploadCategoryImage(res.data._id, imageFile);
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

    updateCategory(id: string, data: Partial<Category>, imageFile: File | null = null) {
        this._state.setLoading(true);
        this._state.setError(false);
        return this._api.update(id, data).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: () => {
                if (imageFile) {
                    this.uploadCategoryImage(id, imageFile);
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

    uploadCategoryImage(id: string, image: File) {
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

    // ─── Dropdown options for other features (e.g. Inventory form) ───────────
    readonly categoryOptions = signal<{ label: string; value: string }[]>([]);
    readonly categoryOptionsLoading = signal(false);

    loadCategoryOptions(): void {
        if (this.categoryOptions().length > 0) return; // already loaded, skip
        this.categoryOptionsLoading.set(true);
        this._api.getAllForDropdown().pipe(
            takeUntilDestroyed(this._destroyRef),
            map((categories) => categories.map((c) => ({ label: c.name, value: c._id })))
        ).subscribe({
            next: (options) => {
                this.categoryOptions.set(options);
                this.categoryOptionsLoading.set(false);
            },
            error: () => this.categoryOptionsLoading.set(false)
        });
    }
}
