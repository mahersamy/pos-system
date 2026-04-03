import {Injectable, inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {ResponseGlobal} from "../../../../core/models/response-global.model";
import {User} from "../../../../core/models/user.model";

@Injectable({
    providedIn: "root",
})
export class UserProfileService {
    private readonly _http = inject(HttpClient);

    /**
     * Fetches the current user's profile information from the central endpoint
     * @returns {Observable<ResponseGlobal<User>>} The raw server user bindings
     */
    getProfile(): Observable<ResponseGlobal<User>> {
        const url = `${environment.apiUrl}/api/v1/users/profile`;
        return this._http.get<ResponseGlobal<User>>(url);
    }

    /**
     * Uploads a new profile image for a specific user identity
     * @param {string} userId - The unique identifier of the user
     * @param {File} file - The raw binary image file context
     * @returns {Observable<ResponseGlobal<User>>} Response status mapping
     */
    uploadProfileImage(userId: string, file: File): Observable<ResponseGlobal<User>> {
        const url = `${environment.apiUrl}/api/v1/users/${userId}/image`;
        const formData = new FormData();
        formData.append("image", file);
        return this._http.patch<ResponseGlobal<User>>(url, formData);
    }
}
