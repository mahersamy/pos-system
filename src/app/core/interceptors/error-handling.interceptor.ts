import {HttpInterceptorFn, HttpErrorResponse} from "@angular/common/http";
import {inject} from "@angular/core";
import {MessageService} from "primeng/api";
import {catchError, throwError} from "rxjs";
import {AuthService} from "../services/auth/auth";

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = "An unknown error occurred!";

            // 1. Client-side or network error
            if (error.status === 0) {
                errorMessage = "Network error. Please check your internet connection.";
            }
            // 2. Extracted specific error message from the backend structure
            else if (error.error && typeof error.error === "object" && error.error.message) {
                errorMessage = error.error.message;
            }
            // 3. Status-based fallback messages
            else {
                switch (error.status) {
                    case 400:
                        errorMessage = "Bad Request. Please verify the data you submitted.";
                        break;
                    case 401:
                        errorMessage = "Your session has expired. Please log in again.";
                        authService.logout(); // Instantly log out on 401
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
                    case 500:
                        errorMessage = "Internal Server Error. Please try again later.";
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
