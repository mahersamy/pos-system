import {HttpInterceptorFn, HttpErrorResponse} from "@angular/common/http";
import {inject} from "@angular/core";
import {MessageService} from "primeng/api";
import {catchError, throwError} from "rxjs";
import {BACKEND_ROUTE} from "../constants/backend.route";

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = "An unknown error occurred!";

            const isRefreshTokenCall = req.url.includes(BACKEND_ROUTE.auth.refreshToken);
            const isPublicAuthCall = [
                BACKEND_ROUTE.auth.login,
                BACKEND_ROUTE.auth.register,
                BACKEND_ROUTE.auth.forgotPassword,
                BACKEND_ROUTE.auth.verifyOtp,
                BACKEND_ROUTE.auth.resetPassword,
            ].some((url) => req.url.includes(url));

            // Skip 401 errors on normal protected requests – authInterceptor handles refresh/retry for those.
            if (error.status === 401 && !isRefreshTokenCall && !isPublicAuthCall) {
                return throwError(() => error);
            }

            // 1. Client-side or network error
            if (error.status === 0) {
                errorMessage = "Network error. Please check your internet connection.";
            }
            // 2. Session expired on token refresh
            else if (isRefreshTokenCall && (error.status === 401 || error.status === 403)) {
                errorMessage = "Session expired. Please log in again.";
            }
            // 3. Extracted specific error message from the backend structure (handles string & string[])
            else if (error.error && typeof error.error === "object" && error.error.message) {
                if (Array.isArray(error.error.message)) {
                    errorMessage = error.error.message.join(", ");
                } else {
                    errorMessage = String(error.error.message);
                }
            }
            // 4. Status-based fallback messages
            else {
                switch (error.status) {
                    case 400:
                        errorMessage = "Bad Request. Please verify the data you submitted.";
                        break;
                    case 403:
                        errorMessage = "Forbidden. You do not have permission to view or do this.";
                        break;
                    case 404:
                        errorMessage = "The requested resource was not found.";
                        break;
                    case 409:
                        errorMessage = "Conflict. This record might already exist.";
                        break;
                    case 422:
                        errorMessage = "Validation Error. Please check your input fields.";
                        break;
                    case 429:
                        errorMessage = "Too many requests. Please try again later.";
                        break;
                    case 500:
                        errorMessage = "Internal Server Error. Please try again later.";
                        break;
                    case 502:
                        errorMessage = "Bad Gateway. The server is temporarily unavailable.";
                        break;
                    case 503:
                        errorMessage = "Service Unavailable. Please try again later.";
                        break;
                }
            }

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
