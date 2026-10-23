export const BACKEND_ROUTE = {
    auth: {
        login: "/api/v1/auth/login",
        register: "/api/v1/auth/register",
        refreshToken: "/api/v1/auth/refresh-token",
        logout: "/api/v1/auth/logout",
        logoutAll: "/api/v1/auth/logout-all",
        forgotPassword: "/api/v1/auth/forgot-password",
        verifyOtp: "/api/v1/auth/verify-otp",
        resetPassword: "/api/v1/auth/reset-password",
    },
    users: {
        profile: "/api/v1/users/profile",
        base: "/api/v1/users",
        permissions: (id: string) => `/api/v1/users/${id}/permissions`,
        password: (id: string) => `/api/v1/users/${id}/password`,
    },
    staff: {
        base: "/api/v1/staff",
        deleteMany: "/api/v1/staff/delete-many",
    },
    notification: {
        addFcmToken: "/api/v1/notification/add-fcm-token",
        inbox: "/api/v1/notification/inbox",
        base: "/api/v1/notification",
    },
    auditLogs: {
        base: "/api/v1/audit-logs",
    },
    category: {
        base: "/api/v1/categories",
    },
    inventory: {
        base: "/api/v1/inventory",
    },
    menu: {
        base: "/api/v1/menus",
    },
    order: {
        base: "/api/v1/orders",
    },
    dashboard: {
        base: "/api/v1/dashboard",
        dailySales: "/api/v1/dashboard/daily-sales",
        monthlyRevenue: "/api/v1/dashboard/monthly-revenue",
        overview: "/api/v1/dashboard/overview",
        popularDishes: "/api/v1/dashboard/popular-dishes",
        lowStock: "/api/v1/dashboard/low-stock",
    },
};
