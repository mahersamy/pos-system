import { inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, of, throwError } from "rxjs";
import { switchMap, tap, map, catchError } from "rxjs/operators";
import { StaffService } from "./staff-api.service";
import { StaffAdaptModel } from "../models/staff-adapt.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";
import { StaffState } from "../state/staff.state";

@Injectable({ providedIn: "root" })
export class StaffFacade extends BaseFacade<StaffAdaptModel> {
    protected override readonly _state = inject(StaffState);
    protected readonly _api = inject(StaffService);

    // ── BaseFacade hooks ────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel) => this._api.getAll(params);
    protected _deleteApi = (id: string) => this._api.delete(id);
    protected _deleteManyApi = (ids: string[]) => this._api.deleteManyStaff(ids);

    // ── Staff-unique: save with optional image upload ───────────────────────
    saveStaff(id: string | null, data: any, imageFile: File | null): Observable<any> {
        this._state.setLoading(true);
        this._state.setError(false);
        const submit$ = id ? this._api.update(id, data) : this._api.create(data);

        return submit$.pipe(
            switchMap((res) => {
                const staffId = id ?? res.data._id;
                if (imageFile instanceof File) {
                    return this._api.uploadImage(staffId, imageFile).pipe(map(() => res));
                }
                return of(res);
            }),
            tap(() => {
                this._state.setLoading(false);
                this._state.setCloseDialog(true);
                this.load();
            }),
            catchError((err) => {
                this._state.setLoading(false);
                this._state.setError(true);
                return throwError(() => err);
            })
        );
    }
     
    deleteMany(ids: string[]): void {
        if (!ids.length) return;
        this._confirmationService.confirm({
            header: `Danger ${this._layout.title()}`,
            message: "Do you want to delete the selected records?",
            type: "delete",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Action: () => {
                this._confirmationService.isBtn1Loading.set(true);
                this._state.setLoading(true);
                this._deleteManyApi(ids).pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
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
