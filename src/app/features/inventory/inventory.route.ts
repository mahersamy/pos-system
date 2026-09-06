import { AppRoute } from '../../core/models/app-route.interface';

export const inventoryRoutes: AppRoute[] = [
    {
        path: 'inventory',
        data: { label: 'Inventory', icon: '/images/sidebar/inventory.png', sidebar: true, title: 'Inventory' },
        loadComponent: () =>
            import('./pages/inventory-list/inventory-list.component').then((m) => m.InventoryListComponent),
    },
];
