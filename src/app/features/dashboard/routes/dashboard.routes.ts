import { AppRoute } from '../../../core/models/app-route.interface';
import { permissionGuard } from '../../../core/guards/role-guard/role-guard';
import { PermissionModule } from '../../../core/constants/permission-module.enum';

export const dashboardRoutes: AppRoute[] = [
    {
        path: 'dashboard',
        canActivate: [permissionGuard],
        data: {
            label: 'Dashboard',
            icon: '/images/sidebar/dashboard.avif',
            iconWidth: 20,
            iconHeight: 20,
            sidebar: true,
            title: 'Dashboard',
            module: PermissionModule.DASHBOARD,
        },
        loadComponent: () =>
            import('../pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    },
];
