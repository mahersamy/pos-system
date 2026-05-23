import { AppRoute } from "../../../core/models/app-route.interface";

export const staffRoutes: AppRoute[] = [
    {
        path: "staff",
        data: {
            label: "Staff",
            icon: "/images/sidebar/staff.avif",
            iconWidth: 16,
            iconHeight: 12,
            sidebar: true,
            title: "Staff",
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
    {
        path: "staff/create",
        data: { title: "Create Staff" },
        loadComponent: () =>
            import("../pages/staff-create/staff-create").then((m) => m.StaffCreate),
    },
];
