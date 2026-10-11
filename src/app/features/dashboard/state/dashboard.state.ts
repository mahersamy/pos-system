import { Injectable, signal } from '@angular/core';
import { DashboardStats, LowStockItem, MonthlyOverviewItem, PopularDishItem } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardState {
    // Stats
    readonly dailySales      = signal<number>(0);
    readonly monthlyRevenue  = signal<number>(0);

    // Charts / Lists
    readonly overview        = signal<MonthlyOverviewItem[]>([]);
    readonly popularDishes   = signal<PopularDishItem[]>([]);
    readonly lowStock        = signal<LowStockItem[]>([]);

    // Loading / Error flags
    readonly loading         = signal(false);
    readonly error           = signal(false);

    // Setters
    setDailySales(v: number)                 { this.dailySales.set(v); }
    setMonthlyRevenue(v: number)             { this.monthlyRevenue.set(v); }
    setOverview(v: MonthlyOverviewItem[])    { this.overview.set(v); }
    setPopularDishes(v: PopularDishItem[])   { this.popularDishes.set(v); }
    setLowStock(v: LowStockItem[])           { this.lowStock.set(v); }
    setLoading(v: boolean)                   { this.loading.set(v); }
    setError(v: boolean)                     { this.error.set(v); }
}
