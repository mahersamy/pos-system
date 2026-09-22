import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { PermissionsService } from "../../services/permissions/permissions";
import { AppRouteData } from "../../models/app-route-data.interface";
import { PermissionModule, PermissionAction } from "../../constants/permission-module.enum";

/**
 * Route guard that enforces module-level permission checks.
 *
 * Reads `module` and `action` from `route.data` (typed via `AppRouteData`).
 * If no `module` is declared on the route, access is always granted.
 * On failure, the user is redirected to `/unauthorized`.
 *
 * Usage in route definition:
 * ```ts
 * {
 *   path: 'staff',
 *   canActivate: [permissionGuard],
 *   data: { module: PermissionModule.STAFF, action: 'read' }
 * }
 * ```
 */
export const permissionGuard: CanActivateFn = (route) => {
    const permissionsService = inject(PermissionsService);
    const router = inject(Router);

    const data = route.data as AppRouteData;
    const module = data?.module as PermissionModule | undefined;
    const action = (data?.action as PermissionAction | undefined) ?? 'read';

    // If the route doesn't declare a module, skip the check
    if (!module) return true;

    if (permissionsService.can(module, action)) return true;

    // Redirect unauthorised users to the 403 Unauthorized page
    return router.createUrlTree(['/unauthorized']);
};
