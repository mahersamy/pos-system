import {Component, inject} from "@angular/core";
import {TableModule} from "primeng/table";
import {DataTableConfig} from "./services/data-table-config";
import {SkeletonModule} from "primeng/skeleton";
import {IdCell} from "./components/id-cell/id-cell";
import {TextCell} from "./components/text-cell/text-cell";
import {EmptyState} from "./components/empty-state/empty-state";
import {TableColumnType} from "./enums/colmun-type.enum";
import {DatePipe, CurrencyPipe} from "@angular/common";
import {UserCell} from "./components/user-cell/user-cell";
import {ActionConfig} from "./models/actions.mode";

@Component({
    selector: "app-data-table",
    imports: [
        TableModule,
        SkeletonModule,
        IdCell,
        TextCell,
        EmptyState,
        DatePipe,
        CurrencyPipe,
        UserCell,
    ],
    templateUrl: "./data-table.html",
    styleUrl: "./data-table.scss",
})
export class DataTable {
    protected readonly _dataTableConfig = inject(DataTableConfig);
    protected readonly _tableColumnType = TableColumnType;
    skeletonRows = Array(10).fill({});

    selectedItems!: any;

    pt = {
        root: {
            class: "custom-table",
        },
    };

    protected resolveFieldData(data: any, field: string): string {
        if (data && field) {
            if (field.indexOf(".") === -1) {
                return data[field];
            } else {
                const fields: string[] = field.split(".");
                let value = data;
                for (let i = 0, len = fields.length; i < len; ++i) {
                    if (value == null) {
                        return "";
                    }
                    value = value[fields[i]];
                }
                return value;
            }
        } else {
            return "";
        }
    }

    onActionClick(event: Event, action: ActionConfig, data: any) {
        event.preventDefault();
        event.stopPropagation();
        action.func(data);
    }
}
