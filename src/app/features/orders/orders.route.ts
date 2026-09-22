import { AppRoute } from '../../core/models/app-route.interface';
import { permissionGuard } from '../../core/guards/role-guard/role-guard';
import { PermissionModule } from '../../core/constants/permission-module.enum';

export const ordersRoutes: AppRoute[] = [
  {
    path: 'orders',
    canActivate: [permissionGuard],
    data: { label: 'Orders', icon: '/images/sidebar/orders.png', sidebar: true, title: 'Orders', module: PermissionModule.ORDERS },
    loadComponent: () =>
      import('./pages/orders-list/orders-list.component').then((m) => m.OrdersListComponent),
  },
];
