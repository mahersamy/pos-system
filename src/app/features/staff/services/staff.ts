import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {ResponseGlobal} from "../../../core/models/response-global.model";
import {Staff} from "../models/staff";
import {GetAllModel} from "../../../core/models/get-all.model";
import {map, Observable} from "rxjs";
import {StaffAdaptModel} from "../models/staff-adapt.model";
import {StaffAdaptor} from "./staff-adaptor";

@Injectable({
    providedIn: "root",
})
export class StaffService {
    private readonly _http = inject(HttpClient);
    private readonly _staffAdaptor = inject(StaffAdaptor);

    /**
     * Retrieves a paginated list of staff members from the API
     * @param {GetAllModel} getAllModel - The query configurations for pagination and sorting
     * @returns {Observable<StaffAdaptModel[]>} Adapted stream of staff models
     */
    getStaffs(getAllModel: GetAllModel): Observable<StaffAdaptModel[]> {
        return this._http
            .get<
                ResponseGlobal<Staff[]>
            >(`${environment.apiUrl}/api/v1/staff?page=${getAllModel.page}&limit=${getAllModel.limit}&search=${getAllModel.search}&sort=${getAllModel.sort}`)
            .pipe(map((response) => response.data.map((item) => this._staffAdaptor.adapt(item))));
    }

    /**
     * Retrieves specific details for a single staff member
     * @param {string} id - The unique identifier of the staff member
     * @returns {Observable<StaffAdaptModel>} Adapted staff profile data
     */
    getStaff(id: string): Observable<StaffAdaptModel> {
        return this._http
            .get<ResponseGlobal<Staff>>(`${environment.apiUrl}/api/v1/staff/${id}`)
            .pipe(map((response) => this._staffAdaptor.adapt(response.data)));
    }

    /**
     * Deletes a given staff member profile
     * @param {string} id - The unique identifier to be deleted
     * @returns {Observable<ResponseGlobal<null>>} The API confirmation state
     */
    deleteStaff(id: string): Observable<ResponseGlobal<null>> {
        return this._http.delete<ResponseGlobal<null>>(`${environment.apiUrl}/api/v1/staff/${id}`);
    }
}
