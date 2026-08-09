import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { BACKEND_ROUTE } from "../../../core/constants/backend.route";
import { GlobalResponse } from "../../../core/models/response-global.model";
import { BaseApiService } from "../../../core/base/base-api.base";
import { Staff } from "../models/staff.model";
import { StaffAdaptModel } from "../models/staff-adapt.model";
import { StaffAdaptor } from "./staff-adaptor";

@Injectable({
    providedIn: "root",
})
export class StaffService extends BaseApiService<Staff, StaffAdaptModel> {
    protected readonly basePath = BACKEND_ROUTE.staff.base;

    // ← plug the adapter in here; BaseApiService._adapt() will call it automatically
    protected override readonly adapter = inject(StaffAdaptor);

    deleteManyStaff(
        ids: string[]
    ): Observable<GlobalResponse<{ deletedCount: number; message: string }>> {
        return this._http.delete<GlobalResponse<{ deletedCount: number; message: string }>>(
            `${environment.apiUrl}${BACKEND_ROUTE.staff.deleteMany}`,
            {
                body: { ids },
            }
        );
    }
}
