import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, switchMap, map } from "rxjs";
import { Router } from "@angular/router";
import { PermissionsService } from "../permissions/permissions";
import { GlobalResponse } from "../../models/response-global.model";
import { environment } from "../../../../environments/environment";
import { User } from "../../../features/users/model/user.model";
import { StorageKeys } from "../../constants/storage.config";
import { BACKEND_ROUTE } from "../../constants/backend.route";
import { StorageService } from "../storage/storage.service";

export interface AuthResponse {
    credential: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthMessageResponse {
    message: string;
}

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _permissionsService = inject(PermissionsService);
    private readonly _storage = inject(StorageService);

    /** Signal tracking the overall global user state */
    currentUser = signal<User | null>(null);

    private readonly _router = inject(Router);

    /** Flag to prevent multiple concurrent refresh requests */
    private _isRefreshing = false;

    // ── Session Management ──────────────────────────────────────────────────

    /**
     * Resets the entire user session, clears the persistent token, and redirects to login
     */
    logout(): void {
        const refreshToken = this.getRefreshToken();
        const accessToken = this.getToken();

        // Fire-and-forget the server-side logout if we have tokens
        if (accessToken) {
            const logoutUrl = `${environment.apiUrl}${BACKEND_ROUTE.auth.logout}`;
            this._http
                .post(logoutUrl, { refreshToken }, { headers: { Authorization: `Bearer ${accessToken}` } })
                .subscribe({ error: () => {} }); // Silently ignore errors during logout
        }

        this._clearSession();
    }

    /**
     * Logs out from all devices by revoking every active session
     */
    logoutAll(): Observable<GlobalResponse<AuthMessageResponse>> {
        const logoutAllUrl = `${environment.apiUrl}${BACKEND_ROUTE.auth.logoutAll}`;
        return this._http.post<GlobalResponse<AuthMessageResponse>>(logoutAllUrl, {}).pipe(
            tap(() => this._clearSession())
        );
    }

    // ── Login ───────────────────────────────────────────────────────────────

    /**
     * Executes the API login request and caches securely
     * @param {string} email - The user identity string
     * @param {string} password - The unhashed credential password
     * @returns {Observable<User>}
     */
    login(email: string, password: string): Observable<User> {
        const loginUrl = `${environment.apiUrl}${BACKEND_ROUTE.auth.login}`;
        return this._http.post<GlobalResponse<AuthResponse>>(loginUrl, { email, password }).pipe(
            tap((response) => {
                this._storeTokens(response.data.credential);
            }),
            switchMap(() => this.getLoggedUserProfile()),
            map((response) => response.data)
        );
    }

    /**
     * Executes an API registration creation request natively
     * @param {string} email - The target identity format map
     * @param {string} password - The secure code registration
     * @returns {Observable<GlobalResponse<AuthResponse>>}
     */
    register(email: string, password: string): Observable<GlobalResponse<AuthResponse>> {
        const registerUrl = `${environment.apiUrl}${BACKEND_ROUTE.auth.register}`;
        return this._http
            .post<GlobalResponse<AuthResponse>>(registerUrl, { email, password })
            .pipe(tap((response) => this._storeTokens(response.data.credential)));
    }

    // ── Token Refresh ───────────────────────────────────────────────────────

    /**
     * Requests a new access token + rotated refresh token from the server
     * @returns {Observable<GlobalResponse<AuthResponse>>}
     */
    refreshToken(): Observable<GlobalResponse<AuthResponse>> {
        const refreshUrl = `${environment.apiUrl}${BACKEND_ROUTE.auth.refreshToken}`;
        const refreshToken = this.getRefreshToken();
        const headers = refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined;
        return this._http
            .post<GlobalResponse<AuthResponse>>(refreshUrl, { refreshToken }, { headers })
            .pipe(tap((response) => this._storeTokens(response.data.credential)));
    }

    /** Whether a token refresh is currently in progress */
    get isRefreshing(): boolean {
        return this._isRefreshing;
    }

    set isRefreshing(value: boolean) {
        this._isRefreshing = value;
    }

    // ── Forgot Password Flow ────────────────────────────────────────────────

    /**
     * Requests a password reset OTP to be sent to the given email
     * @param {string} email - The user's registered email address
     * @returns {Observable<GlobalResponse<AuthMessageResponse>>}
     */
    forgotPassword(email: string): Observable<GlobalResponse<AuthMessageResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.forgotPassword}`;
        return this._http.post<GlobalResponse<AuthMessageResponse>>(url, { email });
    }

    /**
     * Verifies a 6-digit OTP sent to the user's email
     * @param {string} email - The user's registered email address
     * @param {string} otp - The 6-digit OTP code
     * @returns {Observable<GlobalResponse<AuthMessageResponse>>}
     */
    verifyOtp(email: string, otp: string): Observable<GlobalResponse<AuthMessageResponse>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.auth.verifyOtp}`;
        return this._http.post<GlobalResponse<AuthMessageResponse>>(url, { email, otp });
    }

    /**
     * Resets the user's password after OTP verification
     * @param {string} email - The user's registered email address
     * @param {string} otp - The verified 6-digit OTP code
     * @param {string} password - The new password
     * @param {string} confirmPassword - Confirmation of the new password
     * @returns {Observable<GlobalResponse<AuthMessageResponse>>}
     */
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

    // ── Token Accessors ─────────────────────────────────────────────────────

    /**
     * Synchronously checks if a valid authorization token exists in the browser's persistent storage
     * @returns {boolean} True if the token exists, false otherwise
     */
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    /**
     * Syncs cached native platform specific authorization keys
     * @returns {string | null}
     */
    getToken(): string | null {
        return this._storage.get<string>(StorageKeys.TOKEN);
    }

    /**
     * Retrieves the stored refresh token
     * @returns {string | null}
     */
    getRefreshToken(): string | null {
        return this._storage.get<string>(StorageKeys.REFRESH_TOKEN);
    }

    // ── User Profile ────────────────────────────────────────────────────────

    /**
     * Retrieves the structural permission profile from the global endpoint
     * @returns {Observable<GlobalResponse<User>>} The raw server user bindings
     */
    getLoggedUserProfile(): Observable<GlobalResponse<User>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.users.profile}`;
        return this._http.get<GlobalResponse<User>>(url).pipe(
            tap((response) => {
                this.currentUser.set(response.data);
                this._permissionsService.setRole(response.data.role ?? '');
                this._permissionsService.setPermissions(response.data.permissions || {});
            })
        );
    }

    // ── Private Helpers ─────────────────────────────────────────────────────

    /**
     * Persists both access and refresh tokens to local storage
     */
    private _storeTokens(credential: { accessToken: string; refreshToken: string }): void {
        this._storage.set(StorageKeys.TOKEN, credential.accessToken);
        this._storage.set(StorageKeys.REFRESH_TOKEN, credential.refreshToken);
    }

    /**
     * Clears all session data from storage, resets user state, and navigates to login
     */
    private _clearSession(): void {
        this._storage.clear();
        this.currentUser.set(null);
        this._permissionsService.clear();
        this._router.navigate(["/login"]);
    }
}
