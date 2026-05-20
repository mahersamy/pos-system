// import {HttpClient, HttpParams} from "@angular/common/http";
// import {inject, Injectable} from "@angular/core";
// import {environment} from "../../../../environments/environment";
// import {Staff} from "../models/staff";
// import {GetAllModel} from "../../../core/models/get-all.model";
// import {map, Observable} from "rxjs";
// import {StaffAdaptModel} from "../models/staff-adapt.model";
// import {StaffAdaptor} from "./staff-adaptor";
// import {GlobalResponse, GlobalPaginatedResponse} from "../../../core/models/response-global.model";
// import {PaginatedResponse} from "../../../core/models/paginated-response.model"; // ─── Added during pagination
// import {BACKEND_ROUTE} from "../../../core/constants/backend.route";

// @Injectable({
//     providedIn: "root",
// })
// export class StaffService {
//     private readonly _http = inject(HttpClient);
//     private readonly _staffAdaptor = inject(StaffAdaptor);

//     /**
//      * Retrieves a paginated list of staff members from the API
//      * @param {GetAllModel} getAllModel - The query configurations for pagination and sorting
//      * @returns {Observable<PaginatedResponse<StaffAdaptModel>>} Adapted stream of staff models with pagination
//      */
//     getStaffs(getAllModel: GetAllModel): Observable<StaffAdaptModel[]> {
//         let params = new HttpParams();

//         Object.keys(getAllModel).forEach((key) => {
//             const value = getAllModel[key];
//             if (value !== undefined && value !== null && value !== "") {
//                 params = params.set(key, value);
//             }
//         });

//         return this._http
//             .get<
//                 GlobalResponse<Staff[]>
//             >(`${environment.apiUrl}${BACKEND_ROUTE.staff.base}`, {params})
//             .pipe(map((response) => response.data.map((item) => this._staffAdaptor.adapt(item))));
//     }

//     /**
//      * Retrieves specific details for a single staff member
//      */
//     getStaff(id: string): Observable<StaffAdaptModel> {
//         return this._http
//             .get<GlobalResponse<Staff>>(`${environment.apiUrl}${BACKEND_ROUTE.staff.base}/${id}`)
//             .pipe(map((response) => this._staffAdaptor.adapt(response.data)));
//     }

//     /**
//      * Deletes a given staff member profile
//      */
//     deleteStaff(id: string): Observable<GlobalResponse<null>> {
//         return this._http.delete<GlobalResponse<null>>(
//             `${environment.apiUrl}${BACKEND_ROUTE.staff.base}/${id}`
//         );
//     }

//     /**
//      * Deletes multiple staff member profiles
//      */
//     deleteManyStaff(
//         ids: string[]
//     ): Observable<GlobalResponse<{deletedCount: number; message: string}>> {
//         return this._http.delete<GlobalResponse<{deletedCount: number; message: string}>>(
//             `${environment.apiUrl}${BACKEND_ROUTE.staff.deleteMany}`,
//             {
//                 body: {ids},
//             }
//         );
//     }
// }




import {HttpClient, HttpParams} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {Staff} from "../models/staff";
import {GetAllModel} from "../../../core/models/get-all.model";
import {map, Observable} from "rxjs";
import {StaffAdaptModel} from "../models/staff-adapt.model";
import {StaffAdaptor} from "./staff-adaptor";
import {GlobalResponse, GlobalPaginatedResponse} from "../../../core/models/response-global.model";
import {PaginatedResponse} from "../../../core/models/paginated-response.model"; // ─── Added during pagination
import {BACKEND_ROUTE} from "../../../core/constants/backend.route";

@Injectable({
    providedIn: "root",
})
export class StaffService {
    private readonly _http = inject(HttpClient);
    private readonly _staffAdaptor = inject(StaffAdaptor);

    /**
     * Retrieves a paginated list of staff members from the API
     * @param {GetAllModel} getAllModel - The query configurations for pagination and sorting
     * @returns {Observable<PaginatedResponse<StaffAdaptModel>>} Adapted stream of staff models with pagination
     */
    // ─── Updated during pagination: return type changed to PaginatedResponse ──
    // ─── Teammate's HttpParams logic kept exactly as is ───────────────────────
    getStaffs(getAllModel: GetAllModel): Observable<PaginatedResponse<StaffAdaptModel>> {
        let params = new HttpParams();

        Object.keys(getAllModel).forEach((key) => {
            const value = (getAllModel as any)[key];
            if (value !== undefined && value !== null && value !== "") {
                params = params.set(key, value);
            }
        });

        return this._http
            .get<GlobalPaginatedResponse<Staff[]>>(  // ─── changed from GlobalResponse during pagination
                `${environment.apiUrl}${BACKEND_ROUTE.staff.base}`,
                {params}
            )
            .pipe(
                map((response) => ({  // ─── changed from array map to full object during pagination
                    data:        response.data.map((item) => this._staffAdaptor.adapt(item)),
                    total:       response.total,
                    page:        response.page,
                    limit:       response.limit,
                    totalPages:  response.totalPages,
                    hasNextPage: response.hasNextPage,
                    hasPrevPage: response.hasPrevPage,
                }))
            );
    }

    /**
     * Retrieves specific details for a single staff member
     */
    getStaff(id: string): Observable<StaffAdaptModel> {
        return this._http
            .get<GlobalResponse<Staff>>(`${environment.apiUrl}${BACKEND_ROUTE.staff.base}/${id}`)
            .pipe(map((response) => this._staffAdaptor.adapt(response.data)));
    }

    /**
     * Deletes a given staff member profile
     */
    deleteStaff(id: string): Observable<GlobalResponse<null>> {
        return this._http.delete<GlobalResponse<null>>(
            `${environment.apiUrl}${BACKEND_ROUTE.staff.base}/${id}`
        );
    }

    /**
     * Deletes multiple staff member profiles
     */
    deleteManyStaff(ids: string[]): Observable<GlobalResponse<{deletedCount: number; message: string}>> {
        return this._http.delete<GlobalResponse<{deletedCount: number; message: string}>>(
            `${environment.apiUrl}${BACKEND_ROUTE.staff.deleteMany}`,
            {body: {ids}}
        );
    }
}
