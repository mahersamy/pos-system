import {Routes} from "@angular/router";
import {Login} from "./features/auth/login/login";
import {ForgotPassword} from "./features/auth/forgot-password/forgot-password";
import {authGuard, publicGuard} from "./core/guards/auth-guard/auth-guard";
import {NotFound} from "./layout/not-found/not-found";
import {staffRoutes} from "./features/staff/routes/staff.routes";
import {notificationRoutes} from "./features/notification/notification.route";

export const routes: Routes = [
    {
        path: "login",
        component: Login,
        canActivate: [publicGuard],
    },
    {
        path: "forgot-password",
        component: ForgotPassword,
        canActivate: [publicGuard],
    },
    {
        path: "main",
        canActivate: [authGuard],
        loadComponent: () => import("./layout/main-layout/main-layout").then((m) => m.MainLayout),
        children: [
            ...staffRoutes,
            ...notificationRoutes,
            {
                path: "profile",
                data: {title: "HEADER.USER_PROFILE"},
                loadComponent: () =>
                    import("./features/user-profile/pages/user-profile").then((m) => m.UserProfile),
            },
            {
                path: "notifications",
                data: {title: "HEADER.NOTIFICATIONS"},
                loadComponent: () =>
                    import("./features/notification/pages/notification-list/notification-list").then(
                        (m) => m.NotificationList
                    ),
            },
            {
                path: "notifications/:id",
                data: {title: "NOTIFICATION.DETAILS"},
                loadComponent: () =>
                    import("./features/notification/pages/notification-detail/notification-detail").then(
                        (m) => m.NotificationDetail
                    ),
            },
        ],
    },
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
    },
    {
        path: "**",
        component: NotFound,
    },
];
