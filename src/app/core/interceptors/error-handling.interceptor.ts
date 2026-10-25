import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { catchError, throwError } from "rxjs";
import { BACKEND_ROUTE } from "../constants/backend.route";
import { PUBLIC_AUTH_URLS } from "../constants/auth.interceptor.constants";

let lastSessionExpiredToastTime = 0;
const SESSION_EXPIRED_TOAST_THROTTLE_MS = 3000;

/**
 * Resets the session expired toast throttle timestamp.
 * Exported primarily for isolated unit testing.
 */
export function _resetSessionExpiredToastThrottleForTest(): void {
    lastSessionExpiredToastTime = 0;
}

/**
 * Resolves user-facing error messages based on HTTP status code,
 * backend payload message structure, or specialized authentication context.
 *
 * @param error - The HttpErrorResponse returned by Angular HttpClient
 * @param isRefreshTokenCall - Whether this request targeted the token refresh endpoint
 * @returns A user-friendly error message string
 */
export function getErrorMessage(error: HttpErrorResponse, isRefreshTokenCall = false): string {
    // 1. Client-side, network, or CORS error
    if (error.status === 0) {
        return "Network error. Unable to connect to server. Please check your network connection or CORS configuration.";
    }

    // 2. Session expired on token refresh
    if (isRefreshTokenCall && (error.status === 401 || error.status === 403)) {
        return "Session expired. Please log in again.";
    }

    // 3. Extracted specific error message from the backend structure (handles string & string[])
    if (error.error && typeof error.error === "object" && error.error.message) {
        if (Array.isArray(error.error.message)) {
            return error.error.message.join(", ");
        }
        return String(error.error.message);
    }

    // 4. Status-based fallback messages
    switch (error.status) {
        case 400:
            return "Bad Request. Please verify the data you submitted.";
        case 401:
            return "Unauthorized. Please log in.";
        case 403:
            return "Forbidden. You do not have permission to view or do this.";
        case 404:
            return "The requested resource was not found.";
        case 409:
            return "Conflict. This record might already exist.";
        case 422:
            return "Validation Error. Please check your input fields.";
        case 429:
            return "Too many requests. Please try again later.";
        case 500:
            return "Internal Server Error. Please try again later.";
        case 502:
            return "Bad Gateway. The server is temporarily unavailable.";
        case 503:
            return "Service Unavailable. Please try again later.";
        default:
            return "An unknown error occurred!";
    }
}

/**
 * Functional HTTP interceptor that:
 * 1. Formats and displays user-facing error notifications via PrimeNG Toast.
 * 2. Leaves normal protected 401s for authInterceptor to refresh/retry.
 * 3. Prevents duplicate session-expired toasts from concurrent refresh failures.
 * 4. Treats status 0 as a network/CORS connectivity issue.
 * 5. Treats 403 as a permission error without triggering session clearing or refresh.
 */
export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const isRefreshTokenCall = req.url.includes(BACKEND_ROUTE.auth.refreshToken);
            const isPublicAuthCall = PUBLIC_AUTH_URLS.some((url) => req.url.includes(url));

            // Skip 401 errors on normal protected requests – authInterceptor handles refresh/retry for those.
            if (error.status === 401 && !isRefreshTokenCall && !isPublicAuthCall) {
                return throwError(() => error);
            }

            // Suppress duplicate session-expired toasts from concurrent or burst refresh failures
            const isSessionExpired = isRefreshTokenCall && (error.status === 401 || error.status === 403);
            if (isSessionExpired) {
                const now = Date.now();
                if (now - lastSessionExpiredToastTime < SESSION_EXPIRED_TOAST_THROTTLE_MS) {
                    return throwError(() => error);
                }
                lastSessionExpiredToastTime = now;
            }

            const errorMessage = getErrorMessage(error, isRefreshTokenCall);

            // Display via PrimeNG Toast
            messageService.add({
                severity: "error",
                summary: "Error",
                detail: errorMessage,
                life: 5000,
            });

            return throwError(() => error);
        })
    );
};
