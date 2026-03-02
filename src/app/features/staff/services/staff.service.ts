import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ResponseGlobal } from '../../../core/models/response-global.model';
import { Staff } from '../models/staff';
import { GetAllModel } from '../../../core/models/get-all.model';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private readonly http = inject(HttpClient);

  getStaffs(getAllModel: GetAllModel) {
    return this.http.get<ResponseGlobal<Staff[]>>(
      `${environment.apiUrl}/api/v1/staff?page=${getAllModel.page}&limit=${getAllModel.limit}&search=${getAllModel.search}&sort=${getAllModel.sort}`,
    );
  }
}
