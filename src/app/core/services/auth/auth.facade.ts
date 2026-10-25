import { Injectable, inject, DestroyRef } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, tap, switchMap, map, finalize } from "rxjs";
import { GlobalResponse } from "../../models/response-global.model";
import { User } from "../../../features/users/model/user.model";
import { PermissionsService } from "../permissions/permissions";
import { AuthApiService } from "./auth-api.service";
import { AuthState } from "./auth.state";
import { AuthResponse, AuthMessageResponse } from "../../models/auth.model";

export interface AuthActionCallbacks<T = any> {
    onSuccess?: (data: T) => void;
    onError?: (err: any) => void;
}

/**
 * Auth facade — orchestrates AuthApiService (HTTP) + AuthState (signals).
 * Follows the same pattern as StaffFacade and UsersFacade:
 * - Subscribes and handles unsubscriptions internally using DestroyRef + takeUntilDestroyed.
 * - Manages reactive loading and error states.
 * - Exposes signals directly to consumers.
 */
@Injectable({
    providedIn: "root",
})
export class AuthFacade {
    private readonly _api = inject(AuthApiService);
    private readonly _state = inject(AuthState);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _router = inject(Router);
    private readonly _permissionsService = inject(PermissionsService);

    // ── Expose State (signals) ──────────────────────────────────────────────

    readonly currentUser = this._state.currentUser;
    readonly loading = this._state.loading;
    readonly error = this._state.error;

    getToken(): string | null {
        return this._state.getToken();
    }

    getRefreshToken(): string | null {
        return this._state.getRefreshToken();
    }

    isLoggedIn(): boolean {
        return this._state.isLoggedIn();
    }

    setCurrentUser(user: User | null): void {
        this._state.setCurrentUser(user);
    }

    // ── Login Flow ──────────────────────────────────────────────────────────

    /**
     * Authenticates user, stores credentials, loads profile & permissions,
     * and navigates to the first accessible route (or executes custom callback).
     * Internally manages loading/error signals and unsubscription via DestroyRef.
     */
    login(email: string, password: string, callbacks?: AuthActionCallbacks<User>): void {
        this._state.setLoading(true);
        this._state.setError(false);

        this._api
            .login(email, password)
            .pipe(
                tap((res) => this._state.storeTokens(res.data.credential)),
                switchMap(() => this._api.getUserProfile()),
                tap((profileRes) => {
                    this._state.setCurrentUser(profileRes.data);
                    this._state.setPermissions(profileRes.data);
                }),
                map((profileRes) => profileRes.data),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (user) => {
                    this._state.setLoading(false);
                    if (callbacks?.onSuccess) {
                        callbacks.onSuccess(user);
                    } else {
                        const destination = this._permissionsService.getFirstAccessibleRoute();
                        this._router.navigate([destination]);
                    }
                },
                error: (err) => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                    callbacks?.onError?.(err);
                },
            });
    }

    /**
     * Pure Observable login pipeline (for external composition if needed)
     */
    login$(email: string, password: string): Observable<User> {
        return this._api.login(email, password).pipe(
            tap((res) => this._state.storeTokens(res.data.credential)),
            switchMap(() => this.getLoggedUserProfile()),
            map((res) => res.data)
        );
    }

    register(email: string, password: string): Observable<GlobalResponse<AuthResponse>> {
        return this._api.register(email, password).pipe(
            tap((res) => this._state.storeTokens(res.data.credential))
        );
    }

    // ── Token Refresh ───────────────────────────────────────────────────────

    refreshToken(): Observable<GlobalResponse<AuthResponse>> {
        const token = this._state.getRefreshToken();
        return this._api.refreshToken(token).pipe(
            tap((res) => this._state.storeTokens(res.data.credential))
        );
    }

    // ── Logout ──────────────────────────────────────────────────────────────

    /**
     * Clears local session without making an HTTP request.
     * Used when refresh token is invalid or refresh fails.
     */
    logoutLocally(): void {
        this._state.clearSession();
    }

    /**
     * Fires a server-side logout request and clears local session.
     */
    logout(): void {
        const accessToken = this._state.getToken();
        const refreshToken = this._state.getRefreshToken();

        if (accessToken) {
            this._api
                .logout(accessToken, refreshToken)
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe({ error: () => { } });
        }

        this._state.clearSession();
    }

    /**
     * Logs out from all devices by revoking every active session.
     */
    logoutAll(): Observable<GlobalResponse<AuthMessageResponse>> {
        const accessToken = this._state.getToken();
        return this._api.logoutAll(accessToken).pipe(
            finalize(() => this._state.clearSession())
        );
    }

    // ── Forgot Password Flow ────────────────────────────────────────────────

    forgotPassword(
        email: string,
        callbacks?: AuthActionCallbacks<GlobalResponse<AuthMessageResponse>>
    ): void {
        this._state.setLoading(true);
        this._state.setError(false);

        this._api
            .forgotPassword(email)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this._state.setLoading(false);
                    callbacks?.onSuccess?.(res);
                },
                error: (err) => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                    callbacks?.onError?.(err);
                },
            });
    }

    verifyOtp(
        email: string,
        otp: string,
        callbacks?: AuthActionCallbacks<GlobalResponse<AuthMessageResponse>>
    ): void {
        this._state.setLoading(true);
        this._state.setError(false);

        this._api
            .verifyOtp(email, otp)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this._state.setLoading(false);
                    callbacks?.onSuccess?.(res);
                },
                error: (err) => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                    callbacks?.onError?.(err);
                },
            });
    }

    resetPassword(
        email: string,
        otp: string,
        password: string,
        confirmPassword: string,
        callbacks?: AuthActionCallbacks<GlobalResponse<AuthMessageResponse>>
    ): void {
        this._state.setLoading(true);
        this._state.setError(false);

        this._api
            .resetPassword(email, otp, password, confirmPassword)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (res) => {
                    this._state.setLoading(false);
                    callbacks?.onSuccess?.(res);
                },
                error: (err) => {
                    this._state.setLoading(false);
                    this._state.setError(true);
                    callbacks?.onError?.(err);
                },
            });
    }

    // ── User Profile ────────────────────────────────────────────────────────

    getLoggedUserProfile(): Observable<GlobalResponse<User>> {
        return this._api.getUserProfile().pipe(
            tap((res) => {
                this._state.setCurrentUser(res.data);
                this._state.setPermissions(res.data);
            })
        );
    }
}
