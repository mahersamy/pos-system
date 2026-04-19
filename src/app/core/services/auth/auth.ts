import {Injectable, inject, signal, PLATFORM_ID} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {PermissionsService} from "../permissions/permissions";
import {GlobalResponse} from "../../models/response-global.model";
import {environment} from "../../../../environments/environment";
import {isPlatformBrowser} from "@angular/common";
import {User} from "../../models/user.model";
import {StorageKeys} from "../../constants/storage.config";
import {BACKEND_ROUTE} from "../../constants/backend.route";

export interface AuthResponse {
    credential: {
        accessToken: string;
        refreshToken: string;
    };
}

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _permissionsService = inject(PermissionsService);
    private readonly _platformId = inject(PLATFORM_ID);

    /** Signal tracking the overall global user state */
    currentUser = signal<User | null>(null);

    private readonly _router = inject(Router);

    /**
     * Resets the entire user session, clears the persistent token, and redirects to login
     */
    logout(): void {
        if (isPlatformBrowser(this._platformId)) {
            localStorage.clear();
        }
        this.currentUser.set(null);
        this._router.navigate(["/login"]);
    }

    /**
     * Executes the API login request and caches securely
     * @param {string} email - The user identity string
     * @param {string} password - The unhashed credential password
     * @returns {Observable<GlobalResponse<AuthResponse>>}
     */
    login(email: string, password: string): Observable<GlobalResponse<AuthResponse>> {
        const loginUrl = `${environment.apiUrl}${BACKEND_ROUTE.auth.login}`;
        return this._http
            .post<GlobalResponse<AuthResponse>>(loginUrl, {email, password})
            .pipe(tap((response) => this.handleAuthResponse(response)));
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
            .post<GlobalResponse<AuthResponse>>(registerUrl, {email, password})
            .pipe(tap((response) => this.handleAuthResponse(response)));
    }

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
        if (isPlatformBrowser(this._platformId)) {
            return localStorage.getItem(StorageKeys.TOKEN);
        }
        return null;
    }

    /**
     * Retrieves the structural permission profile from the global endpoint
     * @returns {Observable<GlobalResponse<User>>} The raw server user bindings
     */
    getLoggedUserProfile(): Observable<GlobalResponse<User>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.users.profile}`;
        return this._http.get<GlobalResponse<User>>(url).pipe(
            tap((response) => {
                this.currentUser.set(response.data);
                this._permissionsService.setPermissions(response.data.permissions || {});
            })
        );
    }

    private handleAuthResponse(response: GlobalResponse<AuthResponse>): void {
        if (isPlatformBrowser(this._platformId)) {
            localStorage.setItem(StorageKeys.TOKEN, response.data.credential.accessToken);
        }
        this.getLoggedUserProfile().subscribe();
    }
}
