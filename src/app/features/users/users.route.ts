import { AppRoute } from '../../core/models/app-route.interface';

export const usersRoutes: AppRoute[] = [
  {
    path: 'users',
    data: { label: 'Users', icon: '/images/sidebar/users.png', sidebar: true, title: 'Users' },
    loadComponent: () =>
      import('./pages/users-list/users-list.component').then((m) => m.UsersListComponent),
  },
];
