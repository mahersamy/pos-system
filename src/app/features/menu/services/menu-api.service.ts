import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Menu } from '../model/menu.model';
import { GlobalResponse, GlobalPaginatedResponse } from '../../../core/models/response-global.model';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';
import { BaseApiService } from '../../../core/base/base-api.base';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService extends BaseApiService<Menu> {
  constructor() {
    super(BACKEND_ROUTE.menu.base);
  }

  /** Fetch all menus (large limit) for dropdown/select use. */
  getAllForDropdown(): Observable<Menu[]> {
    return this.getAll({ page: 1, limit: 1000 }).pipe(
      map((res) => res.data)
    );
  }
}
