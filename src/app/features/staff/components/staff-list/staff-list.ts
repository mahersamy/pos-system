import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DataTable } from '../../../../shared/data-table/data-table';
import { StaffService } from '../../services/staff.service';
import { DataTableConfig } from '../../../../shared/data-table/services/data-table-config';
import { TableColumnType } from '../../../../shared/data-table/enums/colmun-type.enum';
import { ColumnConfig } from '../../../../shared/data-table/models/colmun-config.model';
import { Subscription } from 'rxjs';
import { StaffAdaptModel } from '../../models/staff-adapt.model';

@Component({
  selector: 'app-staff-list',
  imports: [DataTable],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.scss',
})
export class StaffList implements OnInit, OnDestroy {
  private readonly _staffService = inject(StaffService);
  private readonly _dataTableConfig = inject(DataTableConfig<StaffAdaptModel[]>);
  private _refetchSub!: Subscription;

  readonly columns: ColumnConfig[] = [
    {
      field: '_id',
      header: 'ID',
      type: TableColumnType.ID,
    },
    {
      field: 'staffProfile.fullname',
      header: 'Name',
      type: TableColumnType.USER,
      subtitleField: 'staffProfile.position',
      imageField: 'staffProfile.image',
    },
    {
      field: 'age',
      header: 'Age',
      type: TableColumnType.TEXT,
    },

    {
      field: 'email',
      header: 'Email',
      type: TableColumnType.TEXT,
    },
    {
      field: 'staffProfile.position',
      header: 'Position',
      type: TableColumnType.TEXT,
    },
    {
      field: 'phoneNumber',
      header: 'Phone',
      type: TableColumnType.TEXT,
    },
    {
      field: 'salary',
      header: 'Salary',
      type: TableColumnType.TEXT,
    },
    {
      field: 'DateOfBirth',
      header: 'Date of Birth',
      type: TableColumnType.DATE,
      dateFormat: 'd-MMM-y',
    },
    {
      field: 'timing',
      header: 'Timing',
      type: TableColumnType.TEXT,
    },
  ];

  ngOnInit() {
    this.getData();
    this.tabeleConfigInit();

    this._refetchSub = this._dataTableConfig.refetchEvent.subscribe(() => {
      this.getData();
    });
  }

  ngOnDestroy() {
    this._refetchSub?.unsubscribe();
  }

  tabeleConfigInit() {
    this._dataTableConfig.columns.set(this.columns);
    this._dataTableConfig.isSelectable.set(true);
  }

  getData() {
    this._dataTableConfig.loading.set(true);
    this._dataTableConfig.columns.set(this.columns);

    this._staffService
      .getStaffs({
        page: 1,
        limit: 10,
        search: '',
        sort: 'asc',
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this._dataTableConfig.rows.set(response);
          this._dataTableConfig.loading.set(false);
        },
        error: () => {
          this._dataTableConfig.loading.set(false);
          this._dataTableConfig.isError.set(true);
        },
      });
  }
}
