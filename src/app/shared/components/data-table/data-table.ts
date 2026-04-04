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

    /** Dummy array used for skeleton loader rendering */
    skeletonRows = Array(10).fill({});

    /** Active selected row states */
    selectedItems!: any;

    /** Custom configuration settings for the PrimeVue table component */
    _primeTableConfig = {
        root: {
            class: "custom-table",
        },
    };

    /**
     * Dynamically resolves nested string attributes mapping (e.g., "staffProfile.fullname")
     * @param {any} data - The row object to traverse
     * @param {string} field - The string pointer for the target key
     * @returns {string} The resolved data mapped to the field
     */
    protected resolveFieldData(data: any, field: string): string {
        if (!data || !field) return "";

        if (field.indexOf(".") === -1) {
            return data[field];
        }

        const fields: string[] = field.split(".");
        let value = data;

        for (let index = 0, length = fields.length; index < length; ++index) {
            if (value == null) {
                return "";
            }
            value = value[fields[index]];
        }

        return value;
    }

    /**
     * Executes custom row actions and breaks event bubbling loop
     * @param {Event} event - The DOM click event
     * @param {ActionConfig} action - The action details bound to the click
     * @param {any} data - The row structural data assigned to the button mapping
     */
    onActionClick(event: Event, action: ActionConfig, data: any) {
        event.preventDefault();
        event.stopPropagation();
        action.func(data);
    }
}
