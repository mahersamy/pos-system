import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';
import { DashboardState } from '../state/dashboard.state';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
    private readonly _api      = inject(DashboardApiService);
    private readonly _state    = inject(DashboardState);
    private readonly _destroy  = inject(DestroyRef);

    // ── Exposed signals ──────────────────────────────────────────────────────
    readonly dailySales     = this._state.dailySales;
    readonly monthlyRevenue = this._state.monthlyRevenue;
    readonly overview       = this._state.overview;
    readonly popularDishes  = this._state.popularDishes;
    readonly lowStock       = this._state.lowStock;
    readonly loading        = this._state.loading;
    readonly error          = this._state.error;

    // ── Load all dashboard data in parallel ──────────────────────────────────
    loadAll(): void {
        this._state.setLoading(true);
        this._state.setError(false);

        forkJoin({
            dailySales:     this._api.getDailySales(),
            monthlyRevenue: this._api.getMonthlyRevenue(),
            overview:       this._api.getOverview(),
            popularDishes:  this._api.getPopularDishes(),
            lowStock:       this._api.getLowStock(),
        })
        .pipe(takeUntilDestroyed(this._destroy))
        .subscribe({
            next: (res) => {
                this._state.setDailySales(res.dailySales.data);
                this._state.setMonthlyRevenue(res.monthlyRevenue.data);
                this._state.setOverview(res.overview.data);
                this._state.setPopularDishes(res.popularDishes.data);
                this._state.setLowStock(res.lowStock.data);
                this._state.setLoading(false);
            },
            error: () => {
                this._state.setLoading(false);
                this._state.setError(true);
            },
        });
    }
}
