import {
    HttpErrorResponse,
    HttpInterceptorFn,
} from "@angular/common/http";
import { inject } from "@angular/core";
import {
    catchError,
    finalize,
    map,
    Observable,
    shareReplay,
    switchMap,
    throwError,
} from "rxjs";

import { AuthFacade } from "../services/auth/auth.facade";
import { BACKEND_ROUTE } from "../constants/backend.route";
import { PUBLIC_AUTH_URLS } from "../constants/auth.interceptor.constants";

let refreshInFlight$: Observable<string> | null = null;

/**
 * Resets the shared in-flight refresh observable.
 * Exported primarily for isolated unit testing.
 */
export function _resetRefreshInFlightForTest(): void {
    refreshInFlight$ = null;
}

/**
 * Coordinates a single in-flight token refresh across all concurrent callers.
 * Upon refresh failure, clears the local session via logoutLocally() without
 * firing an additional HTTP logout request.
 */
function refreshAccessToken(authService: AuthFacade): Observable<string> {
    if (!refreshInFlight$) {
        refreshInFlight$ = authService.refreshToken().pipe(
            map((response) => response.data.credential.accessToken),

            catchError((error) => {
                authService.logoutLocally();
                return throwError(() => error);
            }),

            finalize(() => {
                refreshInFlight$ = null;
            }),

            shareReplay({
                bufferSize: 1,
                refCount: false,
            })
        );
    }

    return refreshInFlight$;
}

/**
 * Functional HTTP interceptor that:
 * 1. Attaches the Bearer token to protected outgoing requests.
 * 2. On 401 error, attempts a single refresh-token operation shared by concurrent requests.
 * 3. Retries failed requests with the new access token.
 * 4. Skips refresh if another request has already updated the token.
 * 5. Calls logoutLocally() on refresh failure without looping or secondary logout requests.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthFacade);

    const isPublic = PUBLIC_AUTH_URLS.some((url) => req.url.includes(url));
    const isRefresh = req.url.includes(BACKEND_ROUTE.auth.refreshToken);
    const isLogout = req.url.includes(BACKEND_ROUTE.auth.logout);

    if (isPublic || isRefresh || isLogout) {
        return next(req);
    }

    const tokenUsed = authService.getToken();

    const request = tokenUsed
        ? req.clone({
              setHeaders: {
                  Authorization: `Bearer ${tokenUsed}`,
              },
          })
        : req;

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401) {
                return throwError(() => error);
            }

            if (!authService.getRefreshToken()) {
                authService.logoutLocally();
                return throwError(() => error);
            }

            // A different request may already have refreshed the token.
            const currentToken = authService.getToken();

            if (currentToken && currentToken !== tokenUsed) {
                return next(
                    req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${currentToken}`,
                        },
                    })
                );
            }

            return refreshAccessToken(authService).pipe(
                switchMap((newToken) =>
                    next(
                        req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`,
                            },
                        })
                    )
                )
            );
        })
    );
};
