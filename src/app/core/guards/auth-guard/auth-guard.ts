import {inject} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth";
import {PermissionsService} from "../../services/permissions/permissions";
import {catchError, map, of} from "rxjs";

/**
 * Ensures access is granted only to authenticated users.
 * Redirection to /login occurs if no valid session token is found.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        if (!authService.currentUser()) {
            return authService.getLoggedUserProfile().pipe(
                map(() => true),
                catchError(() => {
                    authService.logout();
                    return of(false);
                })
            );
        }
        return true;
    }

    router.navigate(["/login"]);
    return false;
};

/**
 * Prevents authenticated users from accessing login or registration pages.
 * Redirects to the first route the user actually has access to.
 */
export const publicGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const permissionsService = inject(PermissionsService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        return true;
    }

    const destination = permissionsService.getFirstAccessibleRoute();
    router.navigate([destination]);
    return false;
};
