import {Component, inject} from "@angular/core";
import {DataTableConfig} from "../../services/data-table-config";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: "app-empty-state",
    imports: [TranslateModule],
    templateUrl: "./empty-state.html",
    styleUrl: "./empty-state.scss",
})
export class EmptyState {
    protected readonly _dataTableConfig = inject(DataTableConfig);

    /** Resets the error flag and triggers a reactive refetch stream signal */
    refetch() {
        this._dataTableConfig.tableConfig.refetchEvent.next();
        this._dataTableConfig.tableConfig.isError.set(false);
        this._dataTableConfig.tableConfig.loading.set(true);
    }
}
