import {Routes} from "@angular/router";
import {Login} from "./features/auth/login/login";
import {ForgotPassword} from "./features/auth/forgot-password/forgot-password";
import {authGuard, publicGuard} from "./core/guards/auth-guard/auth-guard";
import {NotFound} from "./layout/not-found/not-found";

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
            {
                path: "staff",
                data: {title: "Staff List"},
                loadComponent: () =>
                    import("./features/staff/components/staff-list/staff-list").then(
                        (m) => m.StaffList
                    ),
            },
            {
                path: "staff/staff-details/:id",
                data: {title: "Staff Details"},
                loadComponent: () =>
                    import("./features/staff/components/staff-details/staff-details").then(
                        (m) => m.StaffDetails
                    ),
            },
            {
                path: "profile",
                data: {title: "User Profile"},
                loadComponent: () =>
                    import("./features/user-profile/pages/user-profile").then((m) => m.UserProfile),
            },
            {
                path: "notifications",
                data: {title: "Notifications"},
                loadComponent: () =>
                    import("./features/notification/pages/notification-list/notification-list").then((m) => m.NotificationList),
            }
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
