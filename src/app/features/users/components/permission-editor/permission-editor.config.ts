import { ModuleMeta } from '../../model/permission-editor.model';

export const DEFAULT_MODULE_ICON = 'fa-solid fa-lock';

export const MODULE_META: Record<string, ModuleMeta> = {
    users:      { label: 'Users',      icon: 'fa-solid fa-users' },
    staff:      { label: 'Staff',      icon: 'fa-solid fa-id-badge' },
    orders:     { label: 'Orders',     icon: 'fa-solid fa-receipt' },
    products:   { label: 'Products',   icon: 'fa-solid fa-box' },
    categories: { label: 'Categories', icon: 'fa-solid fa-tags' },
    reports:    { label: 'Reports',    icon: 'fa-solid fa-chart-bar' },
    settings:   { label: 'Settings',   icon: 'fa-solid fa-gear' },
    inventory:  { label: 'Inventory',  icon: 'fa-solid fa-warehouse' },
    customers:  { label: 'Customers',  icon: 'fa-solid fa-user-group' },
};

export function formatLabel(key: string): string {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]/g, ' ')
        .replace(/^\w/, c => c.toUpperCase());
}
