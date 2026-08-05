import { Component, inject, Type } from "@angular/core";
import { DataTable } from "../../../../shared/components/data-table/data-table";
import { DataTableConfig } from "../../../../shared/components/data-table/services/data-table-config";
import { AuditLogAdaptModel } from "../../models/audit-log-adapt.model";
import {
    AUDIT_LOGS_TABLE_COLUMNS,
    AUDIT_LOGS_FILTER_CONFIG,
} from "./audit-logs-list.config";
import { FilterOutput, FilterPanel } from "../../../../shared/components/filter-panel/filter-panel/filter-panel";
import { SearchBar } from "../../../../shared/components/search-bar/search-bar";
import { TranslateModule } from "@ngx-translate/core";
import { AuditLogsFacade } from "../../services/audit-logs.facade";
import { BaseListComponent } from "../../../../core/base/base-list.base";

@Component({
    selector: "app-audit-logs-list",
    standalone: true,
    imports: [DataTable, FilterPanel, SearchBar, TranslateModule],
    templateUrl: "./audit-logs-list.html",
    styleUrl: "./audit-logs-list.scss",
    providers: [DataTableConfig],
})
export class AuditLogsList extends BaseListComponent<AuditLogAdaptModel, AuditLogsFacade> {
    // ── BaseListComponent hooks ─────────────────────────────────────────────
    protected override readonly _facade = inject(AuditLogsFacade);
    

    // ── AuditLogs-unique ────────────────────────────────────────────────────────

    filterConfig = AUDIT_LOGS_FILTER_CONFIG;


    // ── Table setup ─────────────────────────────────────────────────────────
    protected override _initTableConfig(): void {
        this._dataTableConfig.tableConfig.columns.set(AUDIT_LOGS_TABLE_COLUMNS);
        this._dataTableConfig.tableConfig.isSelectable.set(false);
    }
}
