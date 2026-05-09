import { Component, inject, OnInit, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { DataTableConfig } from "../../../../shared/components/data-table/services/data-table-config";
import { StaffService } from "../../services/staff.service";
import { StaffAdaptModel } from "../../models/staff-adapt.model";
import {
    STAFF_TABLE_COLUMNS,
    STAFF_TABLE_ACTION_META,
    STAFF_TABLE_BULK_ACTIONS,
    STAFF_FILTER_CONFIG,
} from "./staff-list.config";
import { ModuleBase } from "../../../../core/base/module.base";
import { FilterOutput } from "../../../../shared/components/filter-panel/interface/filter-panel.models";
import { FilterPanel } from "../../../../shared/components/filter-panel/filter-panel/filter-panel";
import { SearchBar } from "../../../../shared/components/search-bar/search-bar";
import { TranslateModule } from "@ngx-translate/core";
import { DialogService } from "primeng/dynamicdialog";
import { StaffCreate } from "../staff-create/staff-create";

@Component({
    selector: "app-staff-list",
    imports: [DataTable, FilterPanel, SearchBar, TranslateModule],
    templateUrl: "./staff-list.html",
    styleUrl: "./staff-list.scss",
    providers: [DataTableConfig],
})
export class StaffList implements OnInit, ModuleBase {
    private readonly _staffService = inject(StaffService);
    private readonly _dataTableConfig = inject(DataTableConfig<StaffAdaptModel>);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _dialogService = inject(DialogService);

    filterConfig = STAFF_FILTER_CONFIG;
    filterObj: FilterOutput = {
        search: "",
        sort: "asc",
    };

    searchQuery = "";

    ngOnInit() {
        this._initConfig();
        this._subscribeToRefetch();
        this.fetchData();
    }

    private _initConfig() {
        // ─── Table setup ──────────────────────────────────────────────────────────
        const [viewMeta, editMeta, deleteMeta] = STAFF_TABLE_ACTION_META;
        const [deleteBulkMeta] = STAFF_TABLE_BULK_ACTIONS;

        this._dataTableConfig.tableConfig.columns.set(STAFF_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.actions.set([
            { ...viewMeta, func: (d) => this._onView(d) },
            { ...editMeta, func: (d) => this._onEdit(d) },
            { ...deleteMeta, func: (d) => this._onDelete(d) },
        ]);
        this._dataTableConfig.tableConfig.bulkActions.set([
            { ...deleteBulkMeta, func: (selectedItems) => this._onDeleteBulk(selectedItems) },
        ]);
        this._dataTableConfig.tableConfig.isSelectable.set(true);
    }

    // ─── Filter panel setup ───────────────────────────────────────────────────

    onSearch(query: string) {
        this.searchQuery = query;
        this.filterObj.search = query;
        this.fetchData();
    }

    applayFilter(filter: FilterOutput) {
        if (filter["salary"]) {
            if (filter["salary"].min !== null && filter["salary"].min !== undefined) {
                filter["startSalary"] = filter["salary"].min;
            }
            if (filter["salary"].max !== null && filter["salary"].max !== undefined) {
                filter["endSalary"] = filter["salary"].max;
            }
            delete filter["salary"];
        }

        if (filter["filter"] && Object.keys(filter["filter"]).length === 0) {
            delete filter["filter"];
        }

        this.filterObj = filter;
        this.fetchData();
    }

    // ─── Action handlers ──────────────────────────────────────────────────────

    private _onView(data: StaffAdaptModel) {
        this._router.navigate(["/main/staff/staff-details", data._id]);
    }

    private _onEdit(data: StaffAdaptModel) {
        this._openDialog(data);
    }

    private _onDelete(data: StaffAdaptModel) {
        this._dataTableConfig.tableConfig.loading.set(true);
        this._staffService
            .deleteStaff(data._id)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._dataTableConfig.tableConfig.refetchEvent.next();
                    this._dataTableConfig.tableConfig.loading.set(false);
                },
                error: (err) => {
                    this._dataTableConfig.tableConfig.loading.set(false);
                    this._dataTableConfig.tableConfig.isError.set(true);
                },
            });
    }

    private _onDeleteBulk(selectedItems: StaffAdaptModel[]) {
        if (!selectedItems?.length) return;

        const ids = selectedItems.filter((item) => item._id).map((item) => item._id as string);
        this._dataTableConfig.tableConfig.loading.set(true);
        this._staffService
            .deleteManyStaff(ids)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._dataTableConfig.tableConfig.refetchEvent.next();
                    this._dataTableConfig.tableConfig.loading.set(false);
                },
                error: (err) => {
                    this._dataTableConfig.tableConfig.loading.set(false);
                    this._dataTableConfig.tableConfig.isError.set(true);
                },
            });
    }

    // ─── Data ─────────────────────────────────────────────────────────────────

    fetchData() {
        this._dataTableConfig.tableConfig.loading.set(true);

        this._staffService
            .getStaffs({ page: 1, limit: 10, ...this.filterObj })
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (response) => {
                    this._dataTableConfig.tableConfig.rows.set(response);
                    this._dataTableConfig.tableConfig.loading.set(false);
                },
                error: (error) => {
                    console.error("Failed to load staff list:", error);
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


    // ─── Dialog ─────────────────────────────────────────────────────────────────
    
    private _openDialog(data: StaffAdaptModel) {
        const dialogRef = this._dialogService.open(StaffCreate, {
            header: data ? "Edit Staff" : "Create New Staff",
            data: data,
            width: '450px',
            position: 'right',
            pt: {
                mask: {
                    class: 'premium-dialog-mask'
                },
                root: {
                    class: 'premium-dialog-root'
                },
                header: {
                    class: 'premium-dialog-header'
                },
                title: {
                    class: 'premium-dialog-title'
                },
                content: {
                    class: 'premium-dialog-content'
                },
                pcCloseButton: {
                    root: { class: 'premium-dialog-close-btn' }
                }
            }
        });
    }
}
