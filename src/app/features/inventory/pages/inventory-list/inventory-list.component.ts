import { Component, inject } from "@angular/core";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { DataTableConfig } from "../../../../shared/components/data-table/services/data-table-config";
import { Inventory } from "../../model/inventory.model";
import { SearchBar } from "../../../../shared/components/search-bar/search-bar";
import { TranslateModule } from "@ngx-translate/core";
import { INVENTORY_TABLE_COLUMNS, INVENTORY_TABLE_ACTION_META } from "./inventory-list.config";
import { DialogService } from "primeng/dynamicdialog";
import { InventoryFacade } from "../../services/inventory.facade";
import { BaseListComponent } from "../../../../core/base/base-list.base";
import { InventoryCreate } from "../inventory-create/inventory-create";
import { HasPermissionDirective } from "../../../../shared/directives/has-permission/has-permission.directive";

@Component({
    selector: "app-inventory-list",
    imports: [DataTable, SearchBar, TranslateModule, HasPermissionDirective],
    templateUrl: "./inventory-list.component.html",
    styleUrl: "./inventory-list.component.scss",
    providers: [DataTableConfig, DialogService],
})
export class InventoryListComponent extends BaseListComponent<Inventory, InventoryFacade> {
    // ── BaseListComponent hooks ──────────────────────────────────────────────────
    protected override readonly _facade = inject(InventoryFacade);
    protected override readonly _createComponent = InventoryCreate;
    protected override _createHeader = (isEdit: boolean) =>
        isEdit ? 'INVENTORY.ACTIONS.EDIT' : 'INVENTORY.ACTIONS.CREATE';

    // ── Table setup ──────────────────────────────────────────────────────────────
    protected override _initTableConfig(): void {
        const [editMeta, deleteMeta] = INVENTORY_TABLE_ACTION_META;

        this._dataTableConfig.tableConfig.columns.set(INVENTORY_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.actions.set(
            this.filterActionsByPermission([
                { ...editMeta, func: (d) => this.openCreateForm(d) },
                { ...deleteMeta, func: (d) => this._facade.deleteOne(d._id) },
            ])
        );
        this._dataTableConfig.tableConfig.isSelectable.set(false);
    }
}
