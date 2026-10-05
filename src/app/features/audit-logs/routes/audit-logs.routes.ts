import { AppRoute } from "../../../core/models/app-route.interface";
import { permissionGuard } from "../../../core/guards/role-guard/role-guard";
import { PermissionModule } from "../../../core/constants/permission-module.enum";

export const auditLogsRoutes: AppRoute[] = [
    {
        path: "audit-logs",
        canActivate: [permissionGuard],
        data: {
            label: "AUDIT_LOGS",
            icon: "/images/sidebar/icons8-audit-50.png",
            iconWidth: 16,
            iconHeight: 16,
            sidebar: true,
            title: "SIDEBAR.AUDIT_LOGS",
            module: PermissionModule.AUDIT_LOGS,
        },
        loadComponent: () =>
            import("../pages/audit-logs-list/audit-logs-list").then((m) => m.AuditLogsList),
    },
];
