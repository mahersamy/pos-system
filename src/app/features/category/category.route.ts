import { AppRoute } from '../../core/models/app-route.interface';
import { permissionGuard } from '../../core/guards/role-guard/role-guard';
import { PermissionModule } from '../../core/constants/permission-module.enum';

export const categoryRoutes: AppRoute[] = [
    {
        path: 'category',
        canActivate: [permissionGuard],
        data: { label: 'Category', icon: '/images/sidebar/category.png', sidebar: true, title: 'Category', module: PermissionModule.CATEGORY },
        loadComponent: () =>
            import('./pages/category-list/category-list.component').then((m) => m.CategoryListComponent),
    },
];
