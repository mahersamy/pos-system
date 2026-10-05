/**
 * All backend permission module keys.
 * Must match the keys returned in the `permissions` object from the auth API.
 */
export enum PermissionModule {
    STAFF        = 'staff',
    USERS        = 'users',
    MENU         = 'menu',
    CATEGORY     = 'category',
    INVENTORY    = 'inventory',
    ORDERS       = 'orders',
    AUDIT_LOGS   = 'auditLogs',
    NOTIFICATION = 'notification',
    PRODUCTS     = 'products',
    REPORTS      = 'reports',
    DASHBOARD    = 'dashboard',
}

/** The three possible CRUD-level permission actions */
export type PermissionAction = 'read' | 'write' | 'delete';
