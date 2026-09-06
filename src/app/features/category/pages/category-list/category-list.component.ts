import { Component, inject } from "@angular/core";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { DataTableConfig } from "../../../../shared/components/data-table/services/data-table-config";
import { Category } from "../../model/category.model";
import { SearchBar } from "../../../../shared/components/search-bar/search-bar";
import { TranslateModule } from "@ngx-translate/core";
import { FilterPanel } from "../../../../shared/components/filter-panel/filter-panel/filter-panel";
import { CATEGORY_TABLE_COLUMNS, CATEGORY_TABLE_ACTION_META } from "./category-list.config";
import { DialogService } from "primeng/dynamicdialog";
import { CategoryFacade } from "../../services/category.facade";
import { BaseListComponent } from "../../../../core/base/base-list.base";
import { CategoryCreate } from "../category-create/category-create";

@Component({
    selector: "app-category-list",
    imports: [DataTable, SearchBar, TranslateModule],
    templateUrl: "./category-list.component.html",
    styleUrl: "./category-list.component.scss",
    providers: [DataTableConfig, DialogService],
})
export class CategoryListComponent extends BaseListComponent<Category, CategoryFacade> {
    // ── BaseListComponent hooks ──────────────────────────────────────────────────
    protected override readonly _facade = inject(CategoryFacade);
    protected override readonly _createComponent = CategoryCreate;
    protected override _createHeader = (isEdit: boolean) =>
        isEdit ? 'CATEGORY.ACTIONS.EDIT' : 'CATEGORY.ACTIONS.CREATE';

    // ── Table setup ──────────────────────────────────────────────────────────────
    protected override _initTableConfig(): void {
        const [editMeta, deleteMeta] = CATEGORY_TABLE_ACTION_META;

        this._dataTableConfig.tableConfig.columns.set(CATEGORY_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.actions.set([
            { ...editMeta, func: (d) => this.openCreateForm(d) },
            { ...deleteMeta, func: (d) => this._facade.deleteOne(d._id) },
        ]);
        this._dataTableConfig.tableConfig.isSelectable.set(false);
    }
}
