import {Injectable, inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {GlobalResponse} from "../../../../core/models/response-global.model";
import {User} from "../../../../core/models/user.model";
import {BACKEND_ROUTE} from "../../../../core/constants/backend.route";

@Injectable({
    providedIn: "root",
})
export class UserProfileService {
    private readonly _http = inject(HttpClient);

    /**
     * Fetches the current user's profile information from the central endpoint
     * @returns {Observable<GlobalResponse<User>>} The raw server user bindings
     */
    getProfile(): Observable<GlobalResponse<User>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.users.profile}`;
        return this._http.get<GlobalResponse<User>>(url);
    }

    /**
     * Uploads a new profile image for a specific user identity
     * @param {string} userId - The unique identifier of the user
     * @param {File} file - The raw binary image file context
     * @returns {Observable<GlobalResponse<User>>} Response status mapping
     */
    uploadProfileImage(userId: string, file: File): Observable<GlobalResponse<User>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.users.base}/${userId}/image`;
        const formData = new FormData();
        formData.append("image", file);
        return this._http.patch<GlobalResponse<User>>(url, formData);
    }

    updateProfile(userId: string, data: User): Observable<GlobalResponse<User>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.users.base}/${userId}`;
        return this._http.patch<GlobalResponse<User>>(url, data);
    }
}
