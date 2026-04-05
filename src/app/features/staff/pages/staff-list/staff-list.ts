import {Component, inject, OnInit, DestroyRef} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";
import {DataTable} from "../../../../shared/components/data-table/data-table";
import {DataTableConfig} from "../../../../shared/components/data-table/services/data-table-config";
import {StaffService} from "../../services/staff";
import {StaffAdaptModel} from "../../models/staff-adapt.model";
import {STAFF_TABLE_COLUMNS, STAFF_TABLE_ACTION_META} from "./staff-list.config";

@Component({
    selector: "app-staff-list",
    imports: [DataTable],
    templateUrl: "./staff-list.html",
    styleUrl: "./staff-list.scss",
    providers: [DataTableConfig],
})
export class StaffList implements OnInit {
    private readonly _staffService = inject(StaffService);
    private readonly _dataTableConfig = inject(DataTableConfig<StaffAdaptModel[]>);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    ngOnInit() {
        this._initTableConfig();
        this._subscribeToRefetch();
        this.getData();

    }

    // ─── Table setup ──────────────────────────────────────────────────────────

    private _initTableConfig() {
        const [viewMeta, editMeta, deleteMeta] = STAFF_TABLE_ACTION_META;

        this._dataTableConfig.tableConfig.columns.set(STAFF_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.actions.set([
            {...viewMeta,   func: (d) => this._onView(d)},
            {...editMeta,   func: (d) => this._onEdit(d)},
            {...deleteMeta, func: (d) => this._onDelete(d)},
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
        console.log("Delete Staff Profile", data);
    }

    // ─── Data ─────────────────────────────────────────────────────────────────

    getData() {
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
            .subscribe(() => this.getData());
    }
}
