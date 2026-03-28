import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataTable } from '../../../../shared/data-table/data-table';
import { StaffService } from '../../services/staff.service';
import { DataTableConfig } from '../../../../shared/data-table/services/data-table-config';
import { TableColumnType } from '../../../../shared/data-table/enums/colmun-type.enum';
import { ColumnConfig } from '../../../../shared/data-table/models/colmun-config.model';
import { StaffAdaptModel } from '../../models/staff-adapt.model';
import { ActionConfig } from '../../../../shared/data-table/models/actions.mode';

import { SearchBar } from '../../../../shared/ui/search-bar/search-bar/search-bar';
import {
  FilterPanel,
  FilterFieldConfig,
  FilterFieldType,
  FilterOutput
} from '../../../../shared/ui/filter-panel/filter-panel/filter-panel';

@Component({
  selector: 'app-staff-list',
  imports: [DataTable, SearchBar, FilterPanel],  
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.scss',
})
export class StaffList implements OnInit, OnDestroy {
  private readonly _staffService = inject(StaffService);
  private readonly _dataTableConfig = inject(DataTableConfig<StaffAdaptModel[]>);
  private _refetchSub!: Subscription;

  // ─── additions ───────────────────────────────────────
  searchQuery = '';

  filterConfigs: FilterFieldConfig[] = [
  {
    type: FilterFieldType.TEXT,
    controlName: 'position',
    label: 'Position',
    placeholder: 'e.g. Manager, Chef...',
  },
  
];

  // ─── OG ───────────────────────────────
  readonly columns: ColumnConfig[] = [
    { field: '_id', header: 'ID', type: TableColumnType.ID },
    {
      field: 'staffProfile.fullname',
      header: 'Name',
      type: TableColumnType.USER,
      subtitleField: 'staffProfile.position',
      imageField: 'staffProfile.image',
    },
    { field: 'age', header: 'Age', type: TableColumnType.TEXT, suffix: ' yr' },
    { field: 'email', header: 'Email', type: TableColumnType.TEXT },
    { field: 'phoneNumber', header: 'Phone', type: TableColumnType.TEXT },
    {
      field: 'salary',
      header: 'Salary',
      type: TableColumnType.CURRENCY,
      currencyCode: 'USD',
      currencyDisplay: 'symbol',
    },
    { field: 'DateOfBirth', header: 'Date of Birth', type: TableColumnType.DATE, dateFormat: 'd-MMM-y' },
    { field: 'timing', header: 'Timing', type: TableColumnType.TEXT },
  ];

  readonly actions: ActionConfig[] = [
    {
      icon: 'fa-regular fa-eye',
      classes: 'preview-button',
      func: (data: StaffAdaptModel) => { console.log(data); },
    },
    {
      icon: 'fa-regular fa-pen-to-square',
      classes: 'edit-button',
      func: (data: StaffAdaptModel) => { console.log(data); },
    },
    {
      icon: 'fa-solid fa-trash',
      classes: 'delete-button',
      func: (data: StaffAdaptModel) => { console.log(data); },
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
    this._dataTableConfig.actions.set(this.actions);
    this._dataTableConfig.isSelectable.set(true);
  }

  // ─── additions ───────────────────────────────────────
  onSearchChange(query: string) {
    this.searchQuery = query;
  }

  onApplyFilter(output: FilterOutput) {
    console.log('Filter output:', output);
    this.getData(output);
  }

  // ─── OG getData — only added optional filter param ─────
  getData(filters?: FilterOutput) {
    this._dataTableConfig.loading.set(true);
    this._dataTableConfig.columns.set(this.columns);
    this._dataTableConfig.actions.set(this.actions);

    const { search, sort, ...rest } = filters ?? { search: '', sort: 'asc' };

    // this._staffService
    //   .getStaffs({
    //     page: 1,
    //     limit: 10,
    //     search: search ?? '',
    //     sort: sort ?? 'asc',
    //     ...rest
    //   })
  this._staffService
  .getStaffs({
    page: 1,
    limit: 10,
    ...(filters ?? { search: '', sort: 'asc' }),
    sort: filters?.sort ?? 'asc',
  })
      .subscribe({
        next: (response) => {
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