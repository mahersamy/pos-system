import {Component, inject, OnInit, DestroyRef} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";
import {DataTable} from "../../../../shared/components/data-table/data-table";
import {DataTableConfig} from "../../../../shared/components/data-table/services/data-table-config";
import {StaffService} from "../../services/staff.service";
import {StaffAdaptModel} from "../../models/staff-adapt.model";
import {STAFF_TABLE_COLUMNS, STAFF_TABLE_ACTION_META, STAFF_TABLE_BULK_ACTIONS} from "./staff-list.config";
import { ModuleBase } from "../../../../core/base/module.base";

@Component({
    selector: "app-staff-list",
    imports: [DataTable],
    templateUrl: "./staff-list.html",
    styleUrl: "./staff-list.scss",
    providers: [DataTableConfig],
})
export class StaffList implements OnInit , ModuleBase {
    private readonly _staffService = inject(StaffService);
    private readonly _dataTableConfig = inject(DataTableConfig<StaffAdaptModel>);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    ngOnInit() {
        this._initTableConfig();
        this._subscribeToRefetch();
        this.fetchData();

    }

    // ─── Table setup ──────────────────────────────────────────────────────────

    private _initTableConfig() {
        const [viewMeta, editMeta, deleteMeta] = STAFF_TABLE_ACTION_META;
        const [deleteBulkMeta, addBulkMeta] = STAFF_TABLE_BULK_ACTIONS;

        this._dataTableConfig.tableConfig.columns.set(STAFF_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.actions.set([
            {...viewMeta,   func: (d) => this._onView(d)},
            {...editMeta,   func: (d) => this._onEdit(d)},
            {...deleteMeta, func: (d) => this._onDelete(d)},
        ]);
        this._dataTableConfig.tableConfig.bulkActions.set([
            {...deleteBulkMeta, func: (selectedItems) => this._onDeleteBulk(selectedItems)},
        ]);
        this._dataTableConfig.tableConfig.isSelectable.set(true);
        
    }

    // ─── Action handlers ──────────────────────────────────────────────────────

    private _onView(data: StaffAdaptModel) {
        this._router.navigate(["/main/staff/staff-details", data._id]);
    }

    private _onEdit(data: StaffAdaptModel) {
        console.log("Edit Staff Profile", data);
    }

    private _onDelete(data: StaffAdaptModel) {
       
    }

    private _onDeleteBulk(selectedItems: StaffAdaptModel[]) {
        if (!selectedItems?.length) return;
        
        const ids = selectedItems.filter(item => item._id).map(item => item._id as string);
        this._staffService.deleteManyStaff(ids)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this._dataTableConfig.tableConfig.refetchEvent.next();
                },
                error: (err) => console.error(err)
            });
    }


    // ─── Data ─────────────────────────────────────────────────────────────────

    fetchData() {
        this._dataTableConfig.tableConfig.loading.set(true);

        this._staffService
            .getStaffs({page: 1, limit: 10, search: "", sort: "asc"})
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
}
