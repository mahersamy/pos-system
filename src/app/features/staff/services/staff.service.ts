import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GlobalResponse } from '../../../core/models/response-global.model';
import { Staff } from '../models/staff';
import { GetAllModel } from '../../../core/models/get-all.model';
import { map, Observable } from 'rxjs';
import { StaffAdaptModel } from '../models/staff-adapt.model';
import { StaffAdaptor } from './staff-adaptor';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private readonly http = inject(HttpClient);
  private readonly _staffAdaptor = inject(StaffAdaptor);

  getStaffs(getAllModel: GetAllModel): Observable<StaffAdaptModel[]> {
    return this.http
      .get<
        GlobalResponse<Staff[]>
      >(`${environment.apiUrl}/api/v1/staff?page=${getAllModel.page}&limit=${getAllModel.limit}&search=${getAllModel.search}&sort=${getAllModel.sort}`)
      .pipe(
        map((response: GlobalResponse<Staff[]>) => {
          const data = response.data.map((item: Staff) => {
            return this._staffAdaptor.adapt(item);
          });

          return data;
        }),
      );
  }
}
