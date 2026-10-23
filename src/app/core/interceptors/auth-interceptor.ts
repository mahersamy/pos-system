import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services/auth/auth";
import { BACKEND_ROUTE } from "../constants/backend.route";

/**
 * Subject that holds the latest access token while a refresh is in flight.
 * Queued requests wait until this emits a non-null value.
 */
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/** URLs that should never have an Authorization header attached */
const PUBLIC_URLS: string[] = [
    BACKEND_ROUTE.auth.login,
    BACKEND_ROUTE.auth.register,
    BACKEND_ROUTE.auth.forgotPassword,
    BACKEND_ROUTE.auth.verifyOtp,
    BACKEND_ROUTE.auth.resetPassword,
];

/**
 * Functional interceptor that:
 * 1. Attaches the Bearer token to every outgoing request (unless public)
 * 2. On 401, attempts a single token refresh and retries the original request
 * 3. Queues concurrent requests while a refresh is in-flight
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Skip auth header for public endpoints and refresh-token requests
    const isPublicUrl = PUBLIC_URLS.some((url) => req.url.includes(url));
    const isRefreshCall = req.url.includes(BACKEND_ROUTE.auth.refreshToken);
    if (isPublicUrl || isRefreshCall) {
        return next(req);
    }

    // Attach the current token
    const token = authService.getToken();
    const authedReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Only handle 401 and only for non-refresh requests
            if (error.status !== 401 || req.url.includes(BACKEND_ROUTE.auth.refreshToken)) {
                return throwError(() => error);
            }

            // If we don't have a refresh token, bail out immediately
            if (!authService.getRefreshToken()) {
                authService.logout();
                return throwError(() => error);
            }

            // If a refresh is already in progress, queue this request
            if (authService.isRefreshing) {
                return refreshTokenSubject.pipe(
                    filter((newToken) => newToken !== null),
                    take(1),
                    switchMap((newToken) =>
                        next(
                            req.clone({
                                setHeaders: { Authorization: `Bearer ${newToken}` },
                            })
                        )
                    )
                );
            }

            // Start the refresh
            authService.isRefreshing = true;
            refreshTokenSubject.next(null);

            return authService.refreshToken().pipe(
                switchMap((response) => {
                    authService.isRefreshing = false;
                    const newToken = response.data.credential.accessToken;
                    refreshTokenSubject.next(newToken);

                    // Retry the original request with the new token
                    return next(
                        req.clone({
                            setHeaders: { Authorization: `Bearer ${newToken}` },
                        })
                    );
                }),
                catchError((refreshError) => {
                    authService.isRefreshing = false;
                    refreshTokenSubject.next(null);
                    authService.logout();
                    return throwError(() => refreshError);
                })
            );
        })
    );
};
