/**
 * Barrel re-export for all Reports models and enums.
 * Individual models are split into:
 * - sales-report.model.ts
 * - inventory-report.model.ts
 * - report-params.model.ts
 * - ../enums/trend-group-by.enum.ts
 * - ../enums/stock-movement-type.enum.ts
 */

export * from './sales-report.model';
export * from './inventory-report.model';
export * from './report-params.model';
export * from '../enums/trend-group-by.enum';
export * from '../enums/stock-movement-type.enum';

// Backward-compatible type aliases
export type OrderType = 'dine_in' | 'delivery';
export type OrderStatus = 'in_process' | 'completed' | 'cancelled' | 'ready';
