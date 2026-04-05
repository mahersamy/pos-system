import {inject} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth";
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
 * Redirection to /main occurs if a valid session token is already active.
 */
export const publicGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        return true;
    }

    router.navigate(["/main"]);
    return false;
};
