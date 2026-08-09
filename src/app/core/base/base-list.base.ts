import { Component, DestroyRef, effect, inject, OnInit, Type, Signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { FilterOutput } from "../../shared/components/filter-panel/interface/filter-panel.models";
import { DataTableConfig } from "../../shared/components/data-table/services/data-table-config";
import { BaseFacade } from "./base-facade.base";

/**
 * @abstract BaseListComponent<TModel, TFacade>
 *
 * Generic list component base class. Eliminates repeated boilerplate
 * across every feature list page: filter/search state, dialog opening,
 * DataTableConfig signal sync via effect().
 *
 * ### Usage
 * ```ts
 * @Component({ ... })
 * export class StaffList extends BaseListComponent<StaffAdaptModel, StaffFacade> {
 *   protected readonly _facade = inject(StaffFacade);
 *   protected readonly _createComponent = StaffCreate;
 *   protected _createHeader = (isEdit: boolean) => isEdit ? 'Edit Staff' : 'Create New Staff';
 * }
 * ```
 */
@Component({ template: "" })
export abstract class BaseListComponent<TModel, TFacade extends BaseFacade<TModel>>
    implements OnInit {

    // ── Abstract hooks ──────────────────────────────────────────────────────
    /** The feature facade — inject in the subclass. */
    protected abstract readonly _facade: TFacade;

    /** The create/edit dialog component class. */
    protected _createComponent: Type<any> | null = null;

    /** Dialog header factory. */
    protected _createHeader = (isEdit: boolean): string =>
        isEdit ? "Edit Record" : "Create Record";


    // ── Shared DI ───────────────────────────────────────────────────────────
    protected readonly _dataTableConfig = inject(DataTableConfig<TModel>);
    protected readonly _destroyRef = inject(DestroyRef);
    protected readonly _dialogService = inject(DialogService);

    dialogRef: DynamicDialogRef | undefined | null;

    // ── Shared state ────────────────────────────────────────────────────────
    filterObj: FilterOutput = { search: "", sort: "desc" };
    searchQuery = "";

    constructor() {
        // Sync facade signals → DataTableConfig automatically
        effect(() => {
            this._dataTableConfig.tableConfig.rows.set(this._facade.items());
            this._dataTableConfig.tableConfig.loading.set(this._facade.loading());
            this._dataTableConfig.tableConfig.isError.set(this._facade.error());
            this._dataTableConfig.tableConfig.currentPage.set(this._facade.page());
            this._dataTableConfig.tableConfig.limit.set(this._facade.limit());
            this._dataTableConfig.tableConfig.total.set(this._facade.total());
            this._dataTableConfig.tableConfig.totalPages.set(this._facade.totalPages());
        });
    }

    ngOnInit(): void {
        this._initTableConfig();
        this._subscribeToRefetch();
        this.fetchData();
    }

    // ── Abstract table setup (feature-specific columns/actions) ─────────────
    protected abstract _initTableConfig(): void;

    // ── Shared filter/search ────────────────────────────────────────────────
    onSearch(query: string): void {
        this.searchQuery = query;
        this.filterObj = { ...this.filterObj, search: query };
        this.fetchData();
    }

    applyFilter(filter: FilterOutput): void {
        // Replace entirely to ensure cleared filters are removed, 
        // since FilterPanel emits the complete current state including search/sort.
        this.filterObj = this.transformFilter(filter);
        this.fetchData();
    }

    /**
     * Override in subclass to do feature-specific filter transformations
     * (e.g. mapping salary.min/max → startSalary/endSalary for staff).
     */
    protected transformFilter(filter: FilterOutput): FilterOutput {
        return filter;
    }

    fetchData(): void {
        this._facade.setFilter(this.filterObj);
    }

    // ── Dialog ──────────────────────────────────────────────────────────────
    openCreateForm(data?: TModel): void {
        if (!this._createComponent) return;
        this.dialogRef = this._dialogService.open(this._createComponent, {
            header: this._createHeader(!!data),
            data: data ?? null,
            width: "450px",
            position: "right",
            pt: {
                mask: { class: "premium-dialog-mask" },
                root: { class: "premium-dialog-root" },
                header: { class: "premium-dialog-header" },
                title: { class: "premium-dialog-title" },
                content: { class: "premium-dialog-content" },
                pcCloseButton: { root: { class: "premium-dialog-close-btn" } },
            },
        });

        this.dialogRef?.onClose
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this.fetchData());
    }

    // ── Internal ─────────────────────────────────────────────────────────────
    private _subscribeToRefetch(): void {
        this._dataTableConfig.tableConfig.refetchEvent
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this._facade.setPagination(
                    this._dataTableConfig.tableConfig.currentPage(),
                    this._dataTableConfig.tableConfig.limit()
                );
            });
    }
}
