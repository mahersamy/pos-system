import { AppRoute } from '../../../core/models/app-route.interface';
import { permissionGuard } from '../../../core/guards/role-guard/role-guard';
import { PermissionModule } from '../../../core/constants/permission-module.enum';

export const reportsRoutes: AppRoute[] = [
    {
        path: 'reports',
        canActivate: [permissionGuard],
        data: {
            label: 'Reports',
            icon: '/images/sidebar/reports.avif',
            sidebar: true,
            title: 'Reports',
            module: PermissionModule.REPORTS,
        },
        loadComponent: () =>
            import('../pages/reports/reports.component').then((m) => m.ReportsComponent),
    },
];
