import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { PermissionsService } from "../../services/permissions/permissions";

/**
 * Route guard that redirects the user to their first accessible route.
 * Used as a replacement for the static `redirectTo: 'dashboard'` on the root path
 * so that non-admin roles (e.g. cashiers) don't land on a page they can't see.
 */
export const homeRedirectGuard: CanActivateFn = () => {
    const permissionsService = inject(PermissionsService);
    const router = inject(Router);

    const destination = permissionsService.getFirstAccessibleRoute();
    return router.createUrlTree([destination]);
};
