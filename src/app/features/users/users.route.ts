import { AppRoute } from '../../core/models/app-route.interface';
import { permissionGuard } from '../../core/guards/role-guard/role-guard';
import { PermissionModule } from '../../core/constants/permission-module.enum';

export const usersRoutes: AppRoute[] = [
  {
    path: 'users',
    canActivate: [permissionGuard],
    data: { label: 'Users', icon: '/images/sidebar/users.png', sidebar: true, title: 'Users', module: PermissionModule.USERS },
    loadComponent: () =>
      import('./pages/users-list/users-list.component').then((m) => m.UsersListComponent),
  },
];
