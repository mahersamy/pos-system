import {AppRoute} from "../../core/models/app-route.interface";

export const notificationRoutes: AppRoute[] = [
    {
        path: "notifications",
        data: {title: "Notifications"},
        loadComponent: () =>
            import("./pages/notification-list/notification-list").then((m) => m.NotificationList),
    },
    {
        path: "notifications/:id",
        data: {title: "Notification Details"},
        loadComponent: () =>
            import("./pages/notification-detail/notification-detail").then(
                (m) => m.NotificationDetail
            ),
    },
];
