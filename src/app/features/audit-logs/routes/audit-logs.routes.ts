import { AppRoute } from "../../../core/models/app-route.interface";

export const auditLogsRoutes: AppRoute[] = [
    {
        path: "audit-logs",
        data: {
            label: "AUDIT_LOGS",
            icon: "/images/sidebar/icons8-audit-50.png", // Adjust if another icon is needed
            iconWidth: 16,
            iconHeight: 16,
            sidebar: true,
            title: "SIDEBAR.AUDIT_LOGS",
        },
        loadComponent: () =>
            import("../pages/audit-logs-list/audit-logs-list").then((m) => m.AuditLogsList),
    },
];
