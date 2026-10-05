import { AppRoute } from '../../core/models/app-route.interface';
import { permissionGuard } from '../../core/guards/role-guard/role-guard';
import { PermissionModule } from '../../core/constants/permission-module.enum';

export const menuRoutes: AppRoute[] = [
    {
        path: 'menu',
        canActivate: [permissionGuard],
        data: { label: 'Menu', icon: '/images/sidebar/menu.png', sidebar: true, title: 'Menu', module: PermissionModule.MENU },
        loadComponent: () =>
            import('./pages/menu-list/menu-list.component').then((m) => m.MenuListComponent),
    },
];
