import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { GlobalResponse } from "../../models/response-global.model";
import { BACKEND_ROUTE } from "../../constants/backend.route";
import { User } from "../../../features/users/model/user.model";
import { AuthResponse, AuthMessageResponse } from "../../models/auth.model";

/**
 * Pure HTTP layer for all authentication endpoints.
 * No state management, no side effects — just API calls.
 */
@Injectable({
    providedIn: "root",
})
export class AuthApiService {
    private readonly _http = inject(HttpClient);

    // ── Public Endpoints ────────────────────────────────────────────────────

    login(email: string, password: string): Observable<GlobalResponse<AuthResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.login}`;
        return this._http.post<GlobalResponse<AuthResponse>>(url, { email, password });
    }

    register(email: string, password: string): Observable<GlobalResponse<AuthResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.register}`;
        return this._http.post<GlobalResponse<AuthResponse>>(url, { email, password });
    }

    forgotPassword(email: string): Observable<GlobalResponse<AuthMessageResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.forgotPassword}`;
        return this._http.post<GlobalResponse<AuthMessageResponse>>(url, { email });
    }

    verifyOtp(email: string, otp: string): Observable<GlobalResponse<AuthMessageResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.verifyOtp}`;
        return this._http.post<GlobalResponse<AuthMessageResponse>>(url, { email, otp });
    }

    resetPassword(
        email: string,
        otp: string,
        password: string,
        confirmPassword: string
    ): Observable<GlobalResponse<AuthMessageResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.resetPassword}`;
        return this._http.post<GlobalResponse<AuthMessageResponse>>(url, {
            email,
            otp,
            password,
            confirmPassword,
        });
    }

    // ── Token Endpoints ─────────────────────────────────────────────────────

    refreshToken(token: string | null): Observable<GlobalResponse<AuthResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.refreshToken}`;
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        return this._http.post<GlobalResponse<AuthResponse>>(
            url,
            { refreshToken: token },
            { headers }
        );
    }

    logout(accessToken: string, refreshToken: string | null): Observable<unknown> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.logout}`;
        return this._http.post(url, { refreshToken }, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }

    logoutAll(accessToken: string | null): Observable<GlobalResponse<AuthMessageResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.logoutAll}`;
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
        return this._http.post<GlobalResponse<AuthMessageResponse>>(url, {}, { headers });
    }

    // ── Protected Endpoints ─────────────────────────────────────────────────

    getUserProfile(): Observable<GlobalResponse<User>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.users.profile}`;
        return this._http.get<GlobalResponse<User>>(url);
    }
}
