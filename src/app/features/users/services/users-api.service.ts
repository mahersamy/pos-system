import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../model/user.model';
import { GlobalResponse } from '../../../core/models/response-global.model';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';
import { BaseApiService } from '../../../core/base/base-api.base';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService extends BaseApiService<User> {
  constructor() {
    super(BACKEND_ROUTE.users.base);
  }

  changeRole(id: string, dto: { role: string }): Observable<GlobalResponse<User>> {
    return this._http.patch<GlobalResponse<User>>(
      `${environment.apiUrl}${BACKEND_ROUTE.users.base}/${id}/role`,
      dto
    );
  }

  updatePermissions(id: string, permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>): Observable<GlobalResponse<User>> {
    return this._http.patch<GlobalResponse<User>>(
      `${environment.apiUrl}${BACKEND_ROUTE.users.permissions(id)}`,
      { permissions }
    );
  }

}
