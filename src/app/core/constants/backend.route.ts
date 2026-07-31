export const BACKEND_ROUTE = {
    auth: {
        login: "/api/v1/auth/login",
        register: "/api/v1/auth/register",
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
};
