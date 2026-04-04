import {Component, inject, OnInit, DestroyRef} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DataTable} from "../../../../shared/components/data-table/data-table";
import {StaffService} from "../../services/staff";
import {DataTableConfig} from "../../../../shared/components/data-table/services/data-table-config";
import {StaffAdaptModel} from "../../models/staff-adapt.model";
import {ColumnConfig} from "../../../../shared/components/data-table/models/colmun-config.model";
import {TableColumnType} from "../../../../shared/components/data-table/enums/colmun-type.enum";
import {ActionConfig} from "../../../../shared/components/data-table/models/actions.mode";
import {Router} from "@angular/router";

@Component({
    selector: "app-staff-list",
    imports: [DataTable],
    templateUrl: "./staff-list.html",
    styleUrl: "./staff-list.scss",
})
export class StaffList implements OnInit {
    private readonly _staffService = inject(StaffService);
    private readonly _dataTableConfig = inject(DataTableConfig<StaffAdaptModel[]>);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    readonly columns: ColumnConfig[] = [
        {
            field: "_id",
            header: "ID",
            type: TableColumnType.ID,
        },
        {
            field: "staffProfile.fullname",
            header: "Name",
            type: TableColumnType.USER,
            subtitleField: "staffProfile.position",
            imageField: "staffProfile.image",
        },
        {
            field: "age",
            header: "Age",
            type: TableColumnType.TEXT,
            suffix: " yr",
        },
        {
            field: "email",
            header: "Email",
            type: TableColumnType.TEXT,
        },
        {
            field: "phoneNumber",
            header: "Phone",
            type: TableColumnType.TEXT,
        },
        {
            field: "salary",
            header: "Salary",
            type: TableColumnType.CURRENCY,
            currencyCode: "USD",
            currencyDisplay: "symbol",
        },
        {
            field: "DateOfBirth",
            header: "Date of Birth",
            type: TableColumnType.DATE,
            dateFormat: "d-MMM-y",
        },
        {
            field: "timing",
            header: "Timing",
            type: TableColumnType.TEXT,
        },
    ];

    readonly actions: ActionConfig[] = [
        {
            icon: "fa-solid fa-eye",
            classes: "preview-button",
            func: (data: StaffAdaptModel) => {
                this._router.navigate(["/main/staff/staff-details", data._id]);
            },
        },
        {
            icon: "fa-solid fa-pencil",
            classes: "edit-button",
            func: (data: StaffAdaptModel) => {
                console.log("Edit Staff Profile", data);
            },
        },
        {
            icon: "fa-solid fa-trash",
            classes: "delete-button",
            func: (data: StaffAdaptModel) => {
                console.log("Delete Staff Profile", data);
            },
        },
    ];

    ngOnInit() {
        this.tabeleConfigInit();
        this.getData();

        this._dataTableConfig.refetchEvent
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this.getData();
            });
    }

    /**
     * Initializes the standard configuration structure (columns, actions, selectors) for the DataTable
     */
    tabeleConfigInit() {
        this._dataTableConfig.columns.set(this.columns);
        this._dataTableConfig.actions.set(this.actions);
        this._dataTableConfig.isSelectable.set(true);
    }

    /**
     * Triggers the primary API connection to fetch the staff list
     * Automatically handles data table signals for loading and error states
     */
    getData() {
        this._dataTableConfig.loading.set(true);

        this._staffService
            .getStaffs({
                page: 1,
                limit: 10,
                search: "",
                sort: "asc",
            })
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (response) => {
                    this._dataTableConfig.rows.set(response as StaffAdaptModel[]);
                    this._dataTableConfig.loading.set(false);
                },
                error: (error) => {
                    console.error("Failed to load staff list:", error);
                    this._dataTableConfig.loading.set(false);
                    this._dataTableConfig.isError.set(true);
                },
            });
    }
}
