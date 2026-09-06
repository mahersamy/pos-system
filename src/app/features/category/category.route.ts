import { AppRoute } from '../../core/models/app-route.interface';

export const categoryRoutes: AppRoute[] = [
    {
        path: 'category',
        data: { label: 'Category', icon: '/images/sidebar/category.png', sidebar: true, title: 'Category' },
        loadComponent: () =>
            import('./pages/category-list/category-list.component').then((m) => m.CategoryListComponent),
    },
];
