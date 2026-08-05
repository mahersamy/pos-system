import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { DataTableConfig } from "../../../../shared/components/data-table/services/data-table-config";
import { StaffAdaptModel } from "../../models/staff-adapt.model";
import {
    STAFF_TABLE_COLUMNS,
    STAFF_TABLE_ACTION_META,
    STAFF_TABLE_BULK_ACTIONS,
    STAFF_FILTER_CONFIG,
} from "./staff-list.config";
import { FilterOutput } from "../../../../shared/components/filter-panel/interface/filter-panel.models";
import { FilterPanel } from "../../../../shared/components/filter-panel/filter-panel/filter-panel";
import { SearchBar } from "../../../../shared/components/search-bar/search-bar";
import { TranslateModule } from "@ngx-translate/core";
import { StaffCreate } from "../staff-create/staff-create";
import { StaffFacade } from "../../services/staff.facade";
import { BaseListComponent } from "../../../../core/base/base-list.base";

@Component({
    selector: "app-staff-list",
    imports: [
        DataTable,
        FilterPanel,
        SearchBar,
        TranslateModule,
        Pagination, // ─── Added during pagination
    ],
    templateUrl: "./staff-list.html",
    styleUrl: "./staff-list.scss",
    providers: [DataTableConfig],
})
export class StaffList extends BaseListComponent<StaffAdaptModel, StaffFacade> {
    // ── BaseListComponent hooks ─────────────────────────────────────────────
    protected override readonly _facade = inject(StaffFacade);
    
    protected override readonly _createComponent = StaffCreate;
    protected override _createHeader = (isEdit: boolean) =>
        isEdit ? "Edit Staff" : "Create New Staff";

    // ── Staff-unique ────────────────────────────────────────────────────────
    private readonly _router = inject(Router);

    // ─── Teammate's filter setup (untouched) ──────────────────────────────────
    filterConfig = STAFF_FILTER_CONFIG;

    // ── Table setup ─────────────────────────────────────────────────────────
    protected override _initTableConfig(): void {
        const [viewMeta, editMeta, deleteMeta] = STAFF_TABLE_ACTION_META;
        const [deleteBulkMeta] = STAFF_TABLE_BULK_ACTIONS;

        this._dataTableConfig.tableConfig.columns.set(STAFF_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.actions.set([
            { ...viewMeta, func: (d) => this._onView(d) },
            { ...editMeta, func: (d) => this.openCreateForm(d) },
            { ...deleteMeta, func: (d) => this._facade.deleteOne(d._id as string) },
        ]);
        this._dataTableConfig.tableConfig.bulkActions.set([
            {
                ...deleteBulkMeta,
                func: (items) => {
                    const ids = items.filter((i) => i._id).map((i) => i._id as string);
                    this._facade.deleteMany(ids);
                },
            },
        ]);
        this._dataTableConfig.tableConfig.isSelectable.set(true);
    }

    // ── Staff-specific filter transform (salary range mapping) ───────────────
    protected override transformFilter(filter: FilterOutput): FilterOutput {
        if (filter["salary"]) {
            if (filter["salary"].min != null) filter["startSalary"] = filter["salary"].min;
            if (filter["salary"].max != null) filter["endSalary"] = filter["salary"].max;
            delete filter["salary"];
        }
        return filter;
    }

    // ── Action handlers ──────────────────────────────────────────────────────
    private _onView(data: StaffAdaptModel): void {
        this._router.navigate(["/main/staff/staff-details", data._id]);
    }
}