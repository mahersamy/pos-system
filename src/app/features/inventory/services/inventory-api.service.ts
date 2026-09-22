import { Injectable } from '@angular/core';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';
import { BaseApiService } from '../../../core/base/base-api.base';
import { Inventory } from '../model/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryApiService extends BaseApiService<Inventory> {
  constructor() {
    super(BACKEND_ROUTE.inventory.base);
  }
}
