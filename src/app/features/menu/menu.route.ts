import { AppRoute } from '../../core/models/app-route.interface';

export const menuRoutes: AppRoute[] = [
    {
        path: 'menu',
        data: { label: 'Menu', icon: '/images/sidebar/menu.png', sidebar: true, title: 'Menu' },
        loadComponent: () =>
            import('./pages/menu-list/menu-list.component').then((m) => m.MenuListComponent),
    },
];
