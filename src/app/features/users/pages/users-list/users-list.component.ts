import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataTableConfig } from '../../../../shared/components/data-table/services/data-table-config';
import { UsersApiService } from '../../services/users-api.service';
import { User } from '../../model/user.model';
import { ModuleBase } from '../../../../core/base/module.base';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';
import { TranslateModule } from '@ngx-translate/core';
import { TableColumnType } from '../../../../shared/components/data-table/enums/colmun-type.enum';
import { UserRole } from '../../enums/user-role.enum';
import { FilterPanel } from '../../../../shared/components/filter-panel/filter-panel/filter-panel';
import { FilterOutput } from '../../../../shared/components/filter-panel/interface/filter-panel.models';
import { USERS_TABLE_COLUMNS, USERS_TABLE_ACTION_META, USERS_FILTER_CONFIG } from './users-list.config';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserCreate } from '../user-create/user-create';

@Component({
  selector: 'app-users-list',
  imports: [DataTable, SearchBar, TranslateModule, FilterPanel],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  providers: [DataTableConfig, DialogService],
})
export class UsersListComponent implements OnInit, ModuleBase {
  private readonly _usersApiService = inject(UsersApiService);
  private readonly _dataTableConfig = inject(DataTableConfig<User>);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialogService = inject(DialogService);

  dialogRef: DynamicDialogRef | undefined | null;

  filterConfig = USERS_FILTER_CONFIG;
  filterObj: FilterOutput = {
    search: '',
    sort: 'desc',
  };

  searchQuery = '';

  ngOnInit() {
    this._initConfig();
    this._subscribeToRefetch();
    this.fetchData();
  }

  private _initConfig() {
    const [viewMeta, editMeta, deleteMeta] = USERS_TABLE_ACTION_META;

    const modifiedColumns = USERS_TABLE_COLUMNS.map((col) => {
      if (col.type === TableColumnType.SELECT && col.field === 'role') {
        return {
          ...col,
          onChange: (data: User, newValue: UserRole) => this._onRoleChange(data, newValue)
        };
      }
      return col;
    });

    this._dataTableConfig.tableConfig.columns.set(modifiedColumns);
    this._dataTableConfig.tableConfig.actions.set([
      { ...viewMeta, func: (d) => this._onView(d) },
      { ...editMeta, func: (d) => this._onEdit(d) },
      { ...deleteMeta, func: (d) => this._onDelete(d) },
    ]);
    this._dataTableConfig.tableConfig.isSelectable.set(false);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.filterObj.search = query;
    this.fetchData();
  }

  applyFilter(filter: FilterOutput) {
    if (filter['filter'] && Object.keys(filter['filter']).length === 0) {
      delete filter['filter'];
    }

    this.filterObj = filter;
    this.fetchData();
  }

  private _onView(data: User) {
    console.log('View user:', data);
  }

  private _onEdit(data: User) {
    this.openCreateForm(data);
  }

  private _onDelete(data: User) {
    this._dataTableConfig.tableConfig.loading.set(true);
    this._usersApiService
      .deleteUser(data._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._dataTableConfig.tableConfig.refetchEvent.next();
          this._dataTableConfig.tableConfig.loading.set(false);
        },
        error: () => {
          this._dataTableConfig.tableConfig.loading.set(false);
          this._dataTableConfig.tableConfig.isError.set(true);
        },
      });
  }

  private _onRoleChange(data: User, newRole: UserRole) {
    this._dataTableConfig.tableConfig.loading.set(true);
    this._usersApiService
      .changeRole(data._id, { role: newRole })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._dataTableConfig.tableConfig.loading.set(false);
          data.role = newRole;
          this.fetchData();
        },
        error: () => {
          this._dataTableConfig.tableConfig.loading.set(false);
          this.fetchData();
        },
      });
  }

  fetchData() {
    this._dataTableConfig.tableConfig.loading.set(true);

    this._usersApiService
      .getUsers({ page: 1, limit: 10, ...this.filterObj })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this._dataTableConfig.tableConfig.rows.set(response);
          this._dataTableConfig.tableConfig.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load users list:', error);
          this._dataTableConfig.tableConfig.loading.set(false);
          this._dataTableConfig.tableConfig.isError.set(true);
        },
      });
  }

  private _subscribeToRefetch() {
    this._dataTableConfig.tableConfig.refetchEvent
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.fetchData());
  }

  // ─── Dialog ──────────────────────────────────────────────────────────────────

  openCreateForm(data?: User) {
    this.dialogRef = this._dialogService.open(UserCreate, {
      header: data ? 'Edit User' : 'Create New User',
      data: data ?? null,
      width: '450px',
      position: 'right',
      pt: {
        mask: { class: 'premium-dialog-mask' },
        root: { class: 'premium-dialog-root' },
        header: { class: 'premium-dialog-header' },
        title: { class: 'premium-dialog-title' },
        content: { class: 'premium-dialog-content' },
        pcCloseButton: { root: { class: 'premium-dialog-close-btn' } }
      }
    });

    this.dialogRef?.onClose.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: () => {
        this.fetchData();
      }
    });
  }
}
