import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionsService } from "../permissions/permissions";
import { StorageService } from "../storage/storage.service";
import { StorageKeys } from "../../constants/storage.config";
import { User } from "../../../features/users/model/user.model";
import { AuthCredential } from "../../models/auth.model";

/**
 * Reactive state container for authentication.
 * Follows the same private-signal / readonly-view / setter pattern as BaseState.
 */
@Injectable({
    providedIn: "root",
})
export class AuthState {
    private readonly _storage = inject(StorageService);
    private readonly _permissionsService = inject(PermissionsService);
    private readonly _router = inject(Router);

    // ── Private Signals ─────────────────────────────────────────────────────
    private readonly _currentUser = signal<User | null>(null);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<boolean>(false);

    // ── Public Readonly Views ───────────────────────────────────────────────
    readonly currentUser = this._currentUser.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    // ── Setters ─────────────────────────────────────────────────────────────

    setCurrentUser(user: User | null): void {
        this._currentUser.set(user);
    }

    setLoading(loading: boolean): void {
        this._loading.set(loading);
    }

    setError(error: boolean): void {
        this._error.set(error);
    }

    setPermissions(user: User): void {
        this._permissionsService.setRole(user.role ?? "");
        this._permissionsService.setPermissions(user.permissions || {});
    }

    // ── Token Accessors ─────────────────────────────────────────────────────

    getToken(): string | null {
        return this._storage.get<string>(StorageKeys.TOKEN);
    }

    getRefreshToken(): string | null {
        return this._storage.get<string>(StorageKeys.REFRESH_TOKEN);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    // ── Token Storage ───────────────────────────────────────────────────────

    storeTokens(credential: AuthCredential): void {
        this._storage.set(StorageKeys.TOKEN, credential.accessToken);
        this._storage.set(StorageKeys.REFRESH_TOKEN, credential.refreshToken);
    }

    // ── Session Management ──────────────────────────────────────────────────

    clearSession(): void {
        this._storage.clear();
        this._currentUser.set(null);
        this._permissionsService.clear();
        if (!this._router.url?.includes("/login")) {
            this._router.navigate(["/login"]);
        }
    }
}
