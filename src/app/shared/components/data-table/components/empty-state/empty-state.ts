import {Component, inject} from "@angular/core";
import {DataTableConfig} from "../../services/data-table-config";

@Component({
    selector: "app-empty-state",
    imports: [],
    templateUrl: "./empty-state.html",
    styleUrl: "./empty-state.scss",
})
export class EmptyState {
    protected readonly _dataTableConfig = inject(DataTableConfig);

    refetch() {
        this._dataTableConfig.refetchEvent.next();
        this._dataTableConfig.isError.set(false);
        this._dataTableConfig.loading.set(true);
    }
}
