import { Injectable, signal } from "@angular/core";
import { UserPermissions } from "../../../features/users/model/user.model";
import { PermissionModule, PermissionAction } from "../../constants/permission-module.enum";

/** Matches the role string from the backend */
type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | string;

@Injectable({
    providedIn: "root",
})
export class PermissionsService {
    private readonly _permissions = signal<UserPermissions>({});
    private readonly _isAdmin = signal<boolean>(false);

    /** Read-only signal — use in templates or computed() */
    readonly permissions = this._permissions.asReadonly();
    readonly isAdmin = this._isAdmin.asReadonly();

    /**
     * Called on login. Stores the user's role so we know whether to bypass checks.
     * ADMIN role short-circuits all can() calls to true.
     */
    setRole(role: UserRole): void {
        this._isAdmin.set(role === 'ADMIN');
    }

    /**
     * Stores the permissions object returned by the backend.
     * Pass `undefined` to clear (on logout).
     */
    setPermissions(permissions: UserPermissions | undefined): void {
        this._permissions.set(permissions ?? {});
    }

    /** Clears all permissions and role state. Call on logout. */
    clear(): void {
        this._permissions.set({});
        this._isAdmin.set(false);
    }

    /**
     * Unified permission check.
     * - Admins always return true.
     * - Non-admins are checked against the permissions signal.
     */
    can(module: PermissionModule | string, action: PermissionAction): boolean {
        if (this._isAdmin()) return true;
        const perm = this._permissions()[module as string];
        if (!perm) return false;
        return perm[action] === true;
    }

    // ── Legacy helpers (keep for backwards compatibility) ──────────────────
    canRead(module: string): boolean  { return this.can(module as PermissionModule, 'read'); }
    canWrite(module: string): boolean { return this.can(module as PermissionModule, 'write'); }
    hasRole(role: string, userRole: string | undefined): boolean { return userRole === role; }
}
