import { AppRoute } from "../../../core/models/app-route.interface";
import { permissionGuard } from "../../../core/guards/role-guard/role-guard";
import { PermissionModule } from "../../../core/constants/permission-module.enum";

export const staffRoutes: AppRoute[] = [
    {
        path: "staff",
        canActivate: [permissionGuard],
        data: {
            label: "Staff",
            icon: "/images/sidebar/staff.avif",
            iconWidth: 16,
            iconHeight: 12,
            sidebar: true,
            title: "Staff",
            module: PermissionModule.STAFF,
        },
        loadComponent: () =>
            import("../pages/staff-list/staff-list").then((m) => m.StaffList),
    },
    {
        path: "staff/staff-details/:id",
        data: { title: "Staff Details" },
        loadComponent: () =>
            import("../pages/staff-details/staff-details").then((m) => m.StaffDetails),
    },
];
