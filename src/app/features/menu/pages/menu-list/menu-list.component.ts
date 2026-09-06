import { Component, inject } from "@angular/core";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { DataTableConfig } from "../../../../shared/components/data-table/services/data-table-config";
import { Menu } from "../../model/menu.model";
import { SearchBar } from "../../../../shared/components/search-bar/search-bar";
import { TranslateModule } from "@ngx-translate/core";
import { FilterPanel } from "../../../../shared/components/filter-panel/filter-panel/filter-panel";
import { MENU_TABLE_COLUMNS, MENU_TABLE_ACTION_META } from "./menu-list.config";
import { DialogService } from "primeng/dynamicdialog";
import { MenuFacade } from "../../services/menu.facade";
import { BaseListComponent } from "../../../../core/base/base-list.base";
import { MenuCreate } from "../menu-create/menu-create";

@Component({
    selector: "app-menu-list",
    imports: [DataTable, SearchBar, TranslateModule],
    templateUrl: "./menu-list.component.html",
    styleUrl: "./menu-list.component.scss",
    providers: [DataTableConfig, DialogService],
})
export class MenuListComponent extends BaseListComponent<Menu, MenuFacade> {
    // ── BaseListComponent hooks ──────────────────────────────────────────────────
    protected override readonly _facade = inject(MenuFacade);
    protected override readonly _createComponent = MenuCreate;
    protected override _createHeader = (isEdit: boolean) =>
        isEdit ? 'MENU.ACTIONS.EDIT' : 'MENU.ACTIONS.CREATE';

    // ── Table setup ──────────────────────────────────────────────────────────────
    protected override _initTableConfig(): void {
        const [editMeta, deleteMeta] = MENU_TABLE_ACTION_META;

        this._dataTableConfig.tableConfig.columns.set(MENU_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.actions.set([
            { ...editMeta, func: (d) => this.openCreateForm(d) },
            { ...deleteMeta, func: (d) => this._facade.deleteOne(d._id) },
        ]);
        this._dataTableConfig.tableConfig.isSelectable.set(false);
    }
}
