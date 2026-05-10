import {Component, inject, OnInit, DestroyRef} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";
import {DataTable} from "../../../../shared/components/data-table/data-table";
import {DataTableConfig} from "../../../../shared/components/data-table/services/data-table-config";
import {StaffService} from "../../services/staff.service";
import {StaffAdaptModel} from "../../models/staff-adapt.model";
import {STAFF_TABLE_COLUMNS, STAFF_TABLE_ACTION_META, STAFF_TABLE_BULK_ACTIONS} from "./staff-list.config";
import {ModuleBase} from "../../../../core/base/module.base";
// ─── Added during pagination ───────────────────────────────────────────────────
import {Pagination, PageChangeEvent} from "../../../../shared/components/pagination/pagination";
import {SearchBar} from "../../../../shared/ui/search-bar/search-bar/search-bar";
import {FilterPanel, FilterFieldConfig, FilterFieldType, FilterOutput} from "../../../../shared/ui/filter-panel/filter-panel/filter-panel";

@Component({
    selector: "app-staff-list",
    imports: [
        DataTable,
        Pagination,  // ─── Added during pagination
        SearchBar,   // ─── Added during pagination
        FilterPanel, // ─── Added during pagination
    ],
    templateUrl: "./staff-list.html",
    styleUrl: "./staff-list.scss",
    providers: [DataTableConfig],
})
export class StaffList implements OnInit, ModuleBase {
    private readonly _staffService = inject(StaffService);
    private readonly _dataTableConfig = inject(DataTableConfig<StaffAdaptModel>);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    // ─── Added during pagination ───────────────────────────────────────────────
    searchQuery = '';
    private _activeFilters: FilterOutput | null = null;

    filterConfigs: FilterFieldConfig[] = [
        {
            type: FilterFieldType.TEXT,
            controlName: 'position',
            label: 'Position',
            placeholder: 'e.g. Manager, Chef...',
        },
    ];

    // ─── Expose pagination signals to template ─────────────────────────────────
    readonly currentPage = this._dataTableConfig.tableConfig.currentPage;
    readonly totalPages  = this._dataTableConfig.tableConfig.totalPages;
    readonly total       = this._dataTableConfig.tableConfig.total;
    readonly limit       = this._dataTableConfig.tableConfig.limit;

    ngOnInit() {
        this._initTableConfig();
        this._subscribeToRefetch();
        this.fetchData();
    }

    // ─── Table setup (untouched) ──────────────────────────────────────────────
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

    // ─── Action handlers (untouched) ──────────────────────────────────────────
    private _onView(data: StaffAdaptModel) {
        this._router.navigate(["/main/staff/staff-details", data._id]);
    }

    private _onEdit(data: StaffAdaptModel) {
        console.log("Edit Staff Profile", data);
    }

    private _onDelete(data: StaffAdaptModel) {}

    private _onDeleteBulk(selectedItems: StaffAdaptModel[]) {
        if (!selectedItems?.length) return;
        const ids = selectedItems.filter(item => item._id).map(item => item._id as string);
        this._staffService.deleteManyStaff(ids)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => this._dataTableConfig.tableConfig.refetchEvent.next(),
                error: (err) => console.error(err),
            });
    }

    // ─── Added during pagination: search & filter handlers ────────────────────
    onSearchChange(query: string) {
        this.searchQuery = query;
    }

    onApplyFilter(output: FilterOutput) {
        console.log('Filter output:', output);
        this._activeFilters = output;
        this._dataTableConfig.tableConfig.currentPage.set(1);
        this.fetchData();
    }

    // ─── Added during pagination: page/limit change ────────────────────────────
    onPageChange(event: PageChangeEvent) {
        this._dataTableConfig.tableConfig.currentPage.set(event.page);
        this._dataTableConfig.tableConfig.limit.set(event.limit);
        this.fetchData();
    }

    // ─── fetchData — now uses DataTableConfig.loadData() ──────────────────────
    fetchData() {
        this._dataTableConfig.loadData(
            this._staffService.getStaffs({
                page:  this._dataTableConfig.tableConfig.currentPage(),
                limit: this._dataTableConfig.tableConfig.limit(),
                ...(this._activeFilters ?? {search: '', sort: 'asc'}),
                sort:  this._activeFilters?.sort ?? 'asc',
            }),
            this._destroyRef
        );
    }

    private _subscribeToRefetch() {
        this._dataTableConfig.tableConfig.refetchEvent
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this.fetchData());
    }
}