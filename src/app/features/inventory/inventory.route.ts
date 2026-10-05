import { AppRoute } from '../../core/models/app-route.interface';
import { permissionGuard } from '../../core/guards/role-guard/role-guard';
import { PermissionModule } from '../../core/constants/permission-module.enum';

export const inventoryRoutes: AppRoute[] = [
    {
        path: 'inventory',
        canActivate: [permissionGuard],
        data: { label: 'Inventory', icon: '/images/sidebar/canned-food.png', sidebar: true, title: 'Inventory', module: PermissionModule.INVENTORY },
        loadComponent: () =>
            import('./pages/inventory-list/inventory-list.component').then((m) => m.InventoryListComponent),
    },
];
