import { inject, Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { switchMap, tap, map, catchError } from "rxjs/operators";
import { StaffService } from "./staff-api.service";
import { StaffAdaptModel } from "../models/staff-adapt.model";
import { BaseFacade } from "../../../core/base/base-facade.base";
import { GetAllModel } from "../../../core/models/get-all.model";

@Injectable({ providedIn: "root" })
export class StaffFacade extends BaseFacade<StaffAdaptModel> {
    protected readonly _api = inject(StaffService);

    // ── BaseFacade hooks ────────────────────────────────────────────────────
    protected _loadApi = (params: GetAllModel) => this._api.getAll(params);
    protected _deleteApi = (id: string) => this._api.delete(id);
    protected _deleteManyApi = (ids: string[]) => this._api.deleteManyStaff(ids);

    // ── Staff-unique: save with optional image upload ───────────────────────
    saveStaff(id: string | null, data: any, imageFile: File | null): Observable<any> {
        this._setLoading(true);
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
                this._setLoading(false);
                this.load();
            }),
            catchError((err) => {
                this._setLoading(false);
                this._setError(true);
                return throwError(() => err);
            })
        );
    }
}
