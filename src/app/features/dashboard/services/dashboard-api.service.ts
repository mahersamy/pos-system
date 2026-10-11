import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LowStockItem, MonthlyOverviewItem, PopularDishItem } from '../models/dashboard.model';
import { GlobalResponse } from '../../../core/models/response-global.model';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
    private readonly _http = inject(HttpClient);
    private readonly _apiUrl = environment.apiUrl;

    getDailySales(): Observable<GlobalResponse<number>> {
        return this._http.get<GlobalResponse<number>>(`${this._apiUrl}${BACKEND_ROUTE.dashboard.dailySales}`);
    }

    getMonthlyRevenue(): Observable<GlobalResponse<number>> {
        return this._http.get<GlobalResponse<number>>(`${this._apiUrl}${BACKEND_ROUTE.dashboard.monthlyRevenue}`);
    }

    getOverview(): Observable<GlobalResponse<MonthlyOverviewItem[]>> {
        return this._http.get<GlobalResponse<MonthlyOverviewItem[]>>(`${this._apiUrl}${BACKEND_ROUTE.dashboard.overview}`);
    }

    getPopularDishes(): Observable<GlobalResponse<PopularDishItem[]>> {
        return this._http.get<GlobalResponse<PopularDishItem[]>>(`${this._apiUrl}${BACKEND_ROUTE.dashboard.popularDishes}`);
    }

    getLowStock(): Observable<GlobalResponse<LowStockItem[]>> {
        return this._http.get<GlobalResponse<LowStockItem[]>>(`${this._apiUrl}${BACKEND_ROUTE.dashboard.lowStock}`);
    }
}
