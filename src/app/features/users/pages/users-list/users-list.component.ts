import { Component, inject } from "@angular/core";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { DataTableConfig } from "../../../../shared/components/data-table/services/data-table-config";
import { User } from "../../model/user.model";
import { SearchBar } from "../../../../shared/components/search-bar/search-bar";
import { TranslateModule } from "@ngx-translate/core";
import { TableColumnType } from "../../../../shared/components/data-table/enums/colmun-type.enum";
import { UserRole } from "../../enums/user-role.enum";
import { FilterPanel } from "../../../../shared/components/filter-panel/filter-panel/filter-panel";
import {
  USERS_TABLE_COLUMNS,
  USERS_TABLE_ACTION_META,
  USERS_FILTER_CONFIG,
} from "./users-list.config";
import { DialogService } from "primeng/dynamicdialog";
import { UserCreate } from "../user-create/user-create";
import { UsersFacade } from "../../services/users.facade";
import { BaseListComponent } from "../../../../core/base/base-list.base";

@Component({
  selector: "app-users-list",
  imports: [DataTable, SearchBar, TranslateModule, FilterPanel],
  templateUrl: "./users-list.component.html",
  styleUrl: "./users-list.component.scss",
  providers: [DataTableConfig, DialogService],
})
export class UsersListComponent extends BaseListComponent<User, UsersFacade> {
  // ── BaseListComponent hooks ─────────────────────────────────────────────
  protected override readonly _facade = inject(UsersFacade);
  protected override readonly _createComponent = UserCreate;
  protected override _createHeader = (isEdit: boolean) =>
    isEdit ? "Edit User" : "Create New User";

  // ── Users-unique ────────────────────────────────────────────────────────
  filterConfig = USERS_FILTER_CONFIG;

  // ── Table setup ─────────────────────────────────────────────────────────
  protected override _initTableConfig(): void {
    const [viewMeta, editMeta, deleteMeta] = USERS_TABLE_ACTION_META;

    const columns = USERS_TABLE_COLUMNS.map((col) => {
      if (col.type === TableColumnType.SELECT && col.field === "role") {
        return {
          ...col,
          onChange: (data: User, newValue: UserRole) =>
            this._facade.changeRole(data._id, newValue),
        };
      }
      return col;
    });

    this._dataTableConfig.tableConfig.columns.set(columns);
    this._dataTableConfig.tableConfig.actions.set([
      { ...viewMeta, func: (d) => this._onView(d) },
      { ...editMeta, func: (d) => this.openCreateForm(d) },
      { ...deleteMeta, func: (d) => this._facade.deleteOne(d._id) },
    ]);
    this._dataTableConfig.tableConfig.isSelectable.set(false);
  }

  private _onView(data: User): void {
    console.log("View user:", data);
  }
}
