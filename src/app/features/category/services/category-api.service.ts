import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Category } from '../model/category.model';
import { GlobalResponse } from '../../../core/models/response-global.model';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';
import { BaseApiService } from '../../../core/base/base-api.base';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService extends BaseApiService<Category> {
  constructor() {
    super(BACKEND_ROUTE.category.base);
  }

  // Add category-specific API calls here (e.g., uploadImage if needed)
  
  /** Fetch all categories (large limit) for dropdown/select use. */
  getAllForDropdown(): Observable<Category[]> {
    return this.getAll({ page: 1, limit: 1000 }).pipe(
      map((res) => res.data)
    );
  }
}
