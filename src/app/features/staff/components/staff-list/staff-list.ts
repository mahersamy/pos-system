import { Component, inject } from '@angular/core';
import { DataTable } from '../../../../shared/data-table/data-table';
import { StaffService } from '../../services/staff.service';
import { DataTableConfig } from '../../../../shared/data-table/services/data-table-config';

@Component({
  selector: 'app-staff-list',
  imports: [DataTable],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.scss',
})
export class StaffList {
 private readonly _staffService = inject(StaffService);
 private readonly _dataTableConfig = inject(DataTableConfig);


 ngOnInit(){
  this.getData();
 }

 getData(){
  this._staffService.getStaffs({
    page: 1,
    limit: 10,
    search: '',
    sort: 'asc',
  }).subscribe({
    next: (response) => {
      this._dataTableConfig.columns.set([
        {
          field: 'fullname',
          header: 'Name',
        },
        {
          field:'email',
          header: 'Email',
        },
        {
          field: 'position',
          header: 'Position',
        },
        {
          field: 'phoneNumber',
          header: 'Phone',
        },
      ]);
      this._dataTableConfig.rows.set(response.data);
    },
  });
 }
}
