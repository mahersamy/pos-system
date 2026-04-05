import {Routes} from "@angular/router";

export const staffRoutes: Routes = [
    {
        path: "staff",
        data: {title: "Staff List"},
        loadComponent: () =>
            import("../pages/staff-list/staff-list").then(
                (m) => m.StaffList
            ),
    },
    {
        path: "staff/staff-details/:id",
        data: {title: "Staff Details"},
        loadComponent: () =>
            import("../pages/staff-details/staff-details").then(
                (m) => m.StaffDetails
            ),
    },
];