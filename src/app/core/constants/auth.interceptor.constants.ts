import { BACKEND_ROUTE } from "./backend.route";

/**
 * Public authentication URLs that should never have an Authorization header attached
 * and should not bypass 401 error handling in errorHandlingInterceptor.
 */
export const PUBLIC_AUTH_URLS: readonly string[] = [
    BACKEND_ROUTE.auth.login,
    BACKEND_ROUTE.auth.register,
    BACKEND_ROUTE.auth.forgotPassword,
    BACKEND_ROUTE.auth.verifyOtp,
    BACKEND_ROUTE.auth.resetPassword,
];
