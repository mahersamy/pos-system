import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../model/user.model';
import { GlobalResponse } from '../../../core/models/response-global.model';
import { GetAllModel } from '../../../core/models/get-all.model';
import { BACKEND_ROUTE } from '../../../core/constants/backend.route';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly _http = inject(HttpClient);

  getUsers(getAllModel: GetAllModel): Observable<User[]> {
    let params = new HttpParams();

    Object.keys(getAllModel).forEach((key) => {
      const value = getAllModel[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this._http
      .get<GlobalResponse<User[]>>(`${environment.apiUrl}${BACKEND_ROUTE.users.base}`, { params })
      .pipe(map((response) => response.data));
  }

  getUser(id: string): Observable<User> {
    return this._http
      .get<GlobalResponse<User>>(`${environment.apiUrl}${BACKEND_ROUTE.users.base}/${id}`)
      .pipe(map((response) => response.data));
  }

  deleteUser(id: string): Observable<GlobalResponse<null>> {
    return this._http.delete<GlobalResponse<null>>(
      `${environment.apiUrl}${BACKEND_ROUTE.users.base}/${id}`
    );
  }

  createUser(user: Partial<User>): Observable<GlobalResponse<User>> {
    return this._http.post<GlobalResponse<User>>(
      `${environment.apiUrl}${BACKEND_ROUTE.users.base}`,
      user
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<GlobalResponse<User>> {
    return this._http.patch<GlobalResponse<User>>(
      `${environment.apiUrl}${BACKEND_ROUTE.users.base}/${id}`,
      user
    );
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

  updatePassword(id: string, dto: { password: string }): Observable<GlobalResponse<{ message: string }>> {
    return this._http.patch<GlobalResponse<{ message: string }>>(
      `${environment.apiUrl}${BACKEND_ROUTE.users.password(id)}`,
      dto
    );
  }

  uploadImage(id: string, image: File): Observable<void> {
    const form = new FormData();
    form.append("image", image);
    return this._http.patch(
      `${environment.apiUrl}${BACKEND_ROUTE.users.base}/${id}/image`,
      form
    ).pipe(map(() => { }));
  }
}
